import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRefugioDto } from './dto/create-refugio.dto';
import { UpdateRefugioDto } from './dto/update-refugio.dto';
import { PaginationRefugioDto } from './dto/pagination-refugio.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';

@Injectable()
export class RefugiosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Valida que el estado exista en la base de datos.
   */
  async validateEstado(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({
      where: { id: estadoId },
    });

    if (!estado) {
      throw new BadRequestException(
        `El estado con ID "${estadoId}" no existe. Verifique el estado_id proporcionado.`,
      );
    }
  }

  /**
   * Valida que la ciudad exista y pertenezca al estado indicado.
   */
  async validateCiudad(ciudadId: string, estadoId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({
      where: { id: ciudadId },
      include: { estados: true },
    });

    if (!ciudad) {
      throw new BadRequestException(
        `La ciudad con ID "${ciudadId}" no existe. Verifique el ciudad_id proporcionado.`,
      );
    }

    if (ciudad.estado_id !== estadoId) {
      throw new BadRequestException(
        `La ciudad "${ciudad.nombre}" no pertenece al estado "${ciudad.estados.nombre}". ` +
          `El estado_id proporcionado no coincide con la ciudad seleccionada.`,
      );
    }
  }

  /**
   * Valida que el administrador verificador exista.
   */
  async validateVerificadoPor(verificadoPorId: string): Promise<void> {
    const admin = await this.databaseService.admin_users.findUnique({
      where: { id: verificadoPorId },
    });

    if (!admin) {
      throw new BadRequestException(
        `El administrador con ID "${verificadoPorId}" no existe. ` +
          `Verifique el verificado_por proporcionado.`,
      );
    }
  }

  /**
   * Valida coherencia entre verificado y verificado_por.
   */
  validateVerificadoConsistency(verificado?: boolean, verificadoPor?: string | null): void {
    if (verificado === true && !verificadoPor) {
      throw new BadRequestException(
        'Si el refugio está marcado como verificado, debe indicar quién lo verificó (verificado_por).',
      );
    }

    if (verificado === false && verificadoPor) {
      throw new BadRequestException(
        'No se puede asignar un verificador si el refugio no está marcado como verificado.',
      );
    }
  }

  /**
   * Ejecuta todas las validaciones de negocio para create/update.
   */
  async validateBusinessRules(
    dto: CreateRefugioDto | UpdateRefugioDto,
    isUpdate = false,
  ): Promise<void> {
    const { estado_id, ciudad_id, verificado, verificado_por } = dto;

    // Validar estado si se proporciona
    if (estado_id) {
      await this.validateEstado(estado_id);
    }

    // Validar ciudad si se proporciona
    if (ciudad_id) {
      if (!estado_id && !isUpdate) {
        throw new BadRequestException(
          'Debe proporcionar un estado_id junto con el ciudad_id.',
        );
      }

      // Solo podemos validar la relación ciudad-estado si ambos están presentes
      if (estado_id) {
        await this.validateCiudad(ciudad_id, estado_id);
      }
    }

    // Validar verificado_por si se proporciona
    if (verificado_por) {
      await this.validateVerificadoPor(verificado_por);
    }

    // Validar coherencia verificado / verificado_por
    if (verificado !== undefined || verificado_por !== undefined) {
      this.validateVerificadoConsistency(verificado, verificado_por);
    }
  }

  async create(createRefugioDto: CreateRefugioDto) {
    await this.validateBusinessRules(createRefugioDto);

    try {
      return await this.databaseService.refugios.create({
        data: createRefugioDto,
        include: {
          ciudades: true,
          estados: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationRefugioDto: PaginationRefugioDto) {
    const page = paginationRefugioDto.page ?? 1;
    const limit = paginationRefugioDto.limit ?? 20;
    const { search, state } = paginationRefugioDto;

    const where: Prisma.refugiosWhereInput = {
      ...(state && {
        estados: { nombre: { contains: state, mode: 'insensitive' } },
      }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { ciudades: { nombre: { contains: search, mode: 'insensitive' } } },
          { direccion: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [refugios, total] = await this.databaseService.$transaction([
      this.databaseService.refugios.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { ciudades: true, estados: true },
      }),
      this.databaseService.refugios.count({ where }),
    ]);

    return PaginationHelper.build(refugios, total, page, limit);
  }

  async findOne(id: string) {
    const refugio = await this.databaseService.refugios.findUnique({
      where: { id },
      include: {
        ciudades: true,
        estados: true,
        refugiados: true,
      },
    });

    if (!refugio) {
      throw new NotFoundException(`Refugio con ID "${id}" no encontrado.`);
    }

    return refugio;
  }

  async update(id: string, updateRefugioDto: UpdateRefugioDto) {
    // Verificar que se envía al menos un campo para actualizar
    if (Object.keys(updateRefugioDto).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    // Verificar si el refugio existe primero
    const existingRefugio = await this.findOne(id);

    // Si se actualiza ciudad sin estado, usar el estado existente para validar
    if (updateRefugioDto.ciudad_id && !updateRefugioDto.estado_id) {
      await this.validateCiudad(updateRefugioDto.ciudad_id, existingRefugio.estado_id);
    }

    // Resolver coherencia de verificado considerando datos existentes
    const finalVerificado = updateRefugioDto.verificado ?? existingRefugio.verificado;
    const finalVerificadoPor = updateRefugioDto.verificado_por !== undefined
      ? updateRefugioDto.verificado_por
      : existingRefugio.verificado_por;

    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    // Validar reglas de negocio (estado, ciudad-estado, admin)
    await this.validateBusinessRules(updateRefugioDto, true);

    try {
      return await this.databaseService.refugios.update({
        where: { id },
        data: updateRefugioDto,
        include: {
          ciudades: true,
          estados: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const refugio = await this.findOne(id);

    // Verificar si tiene refugiados asociados antes de eliminar
    if (refugio.refugiados && refugio.refugiados.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el refugio "${refugio.nombre}" porque tiene ` +
          `${refugio.refugiados.length} refugiado(s) asociado(s). ` +
          `Debe reubicar o desvincular los refugiados antes de eliminar el refugio.`,
      );
    }

    try {
      return await this.databaseService.refugios.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  /**
   * Maneja errores de Prisma y los traduce a excepciones HTTP descriptivas.
   */
  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(
            `Ya existe un refugio con los mismos valores en: ${fields}. No se permiten duplicados.`,
          );
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(
            `Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`,
          );
        }
        case 'P2025':
          throw new NotFoundException(
            `No se encontró el registro que se intentó ${operacion}.`,
          );
        default:
          throw new BadRequestException(
            `Error de base de datos al ${operacion} el refugio (código: ${error.code}).`,
          );
      }
    }

    throw error;
  }
}
