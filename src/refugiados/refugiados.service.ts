import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRefugiadoDto } from './dto/create-refugiado.dto';
import { UpdateRefugiadoDto } from './dto/update-refugiado.dto';
import { PaginationRefugiadoDto } from './dto/pagination-refugiado.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';

@Injectable()
export class RefugiadosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Valida que el refugio exista en la base de datos.
   */
  private async validateRefugio(refugioId: string): Promise<void> {
    const refugio = await this.databaseService.refugios.findUnique({
      where: { id: refugioId },
    });

    if (!refugio) {
      throw new BadRequestException(
        `El refugio con ID "${refugioId}" no existe. Verifique el refugio_id proporcionado.`,
      );
    }
  }

  /**
   * Valida que el administrador verificador exista.
   */
  private async validateVerificadoPor(verificadoPorId: string): Promise<void> {
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
  private validateVerificadoConsistency(verificado?: boolean, verificadoPor?: string | null): void {
    if (verificado === true && !verificadoPor) {
      throw new BadRequestException(
        'Si el refugiado está marcado como verificado, debe indicar quién lo verificó (verificado_por).',
      );
    }

    if (verificado === false && verificadoPor) {
      throw new BadRequestException(
        'No se puede asignar un verificador si el refugiado no está marcado como verificado.',
      );
    }
  }

  /**
   * Ejecuta todas las validaciones de negocio para create/update.
   */
  private async validateBusinessRules(dto: CreateRefugiadoDto | UpdateRefugiadoDto): Promise<void> {
    const { refugio_id, verificado, verificado_por } = dto;

    if (refugio_id) {
      await this.validateRefugio(refugio_id);
    }

    if (verificado_por) {
      await this.validateVerificadoPor(verificado_por);
    }

    if (verificado !== undefined || verificado_por !== undefined) {
      this.validateVerificadoConsistency(verificado, verificado_por);
    }
  }

  async create(createRefugiadoDto: CreateRefugiadoDto) {
    await this.validateBusinessRules(createRefugiadoDto);

    try {
      return await this.databaseService.refugiados.create({
        data: createRefugiadoDto,
        include: {
          refugios: {
            include: {
              ciudades: true,
              estados: true,
            },
          },
          admin_users: {
            select: { id: true, email: true, rol: true },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationRefugiadoDto: PaginationRefugiadoDto) {
    const page = paginationRefugiadoDto.page ?? 1;
    const limit = paginationRefugiadoDto.limit ?? 20;
    const { search, refugio_id, verificado } = paginationRefugiadoDto;

    const where: Prisma.refugiadosWhereInput = {
      ...(refugio_id && { refugio_id }),
      ...(verificado !== undefined && { verificado }),
      ...(search && {
        OR: [
          { nombre_completo: { contains: search, mode: 'insensitive' } },
          { cedula: { contains: search, mode: 'insensitive' } },
          { telefono: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [refugiados, total] = await this.databaseService.$transaction([
      this.databaseService.refugiados.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          refugios: {
            select: { id: true, nombre: true },
          },
        },
      }),
      this.databaseService.refugiados.count({ where }),
    ]);

    return PaginationHelper.build(refugiados, total, page, limit);
  }

  async findOne(id: string) {
    const refugiado = await this.databaseService.refugiados.findUnique({
      where: { id },
      include: {
        refugios: {
          include: {
            ciudades: true,
            estados: true,
          },
        },
        admin_users: {
          select: { id: true, email: true, rol: true },
        },
      },
    });

    if (!refugiado) {
      throw new NotFoundException(`Refugiado con ID "${id}" no encontrado.`);
    }

    return refugiado;
  }

  async update(id: string, updateRefugiadoDto: UpdateRefugiadoDto) {
    if (Object.keys(updateRefugiadoDto).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    const existingRefugiado = await this.findOne(id);

    // Resolver coherencia de verificado considerando datos existentes
    const finalVerificado = updateRefugiadoDto.verificado ?? existingRefugiado.verificado;
    const finalVerificadoPor = updateRefugiadoDto.verificado_por !== undefined
      ? updateRefugiadoDto.verificado_por
      : existingRefugiado.verificado_por;

    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    // Validar reglas de negocio
    await this.validateBusinessRules(updateRefugiadoDto);

    try {
      return await this.databaseService.refugiados.update({
        where: { id },
        data: updateRefugiadoDto,
        include: {
          refugios: {
            include: {
              ciudades: true,
              estados: true,
            },
          },
          admin_users: {
            select: { id: true, email: true, rol: true },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.databaseService.refugiados.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  /**
   * Maneja errores de Prisma y los traduce a excepciones HTTP descriptivas.
   */
  private handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(
            `Ya existe un refugiado con los mismos valores en: ${fields}. No se permiten duplicados.`,
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
            `Error de base de datos al ${operacion} el refugiado (código: ${error.code}).`,
          );
      }
    }

    throw error;
  }
}
