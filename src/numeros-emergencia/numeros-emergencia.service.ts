import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateNumeroEmergenciaDto } from './dto/create-numero-emergencia.dto';
import { UpdateNumeroEmergenciaDto } from './dto/update-numero-emergencia.dto';
import { PaginationNumeroEmergenciaDto } from './dto/pagination-numero-emergencia.dto';
import { NumeroEmergenciaMapper } from './mappers/numero-emergencia.mapper';

@Injectable()
export class NumerosEmergenciaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateEstadoExists(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({ where: { id: estadoId } });
    if (!estado) throw new BadRequestException(`El estado con ID "${estadoId}" no existe.`);
  }

  async validateCiudadExists(ciudadId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudadId } });
    if (!ciudad) throw new BadRequestException(`La ciudad con ID "${ciudadId}" no existe.`);
  }

  async validateTipoExists(tipoId: string): Promise<void> {
    const tipo = await this.databaseService.tipos_numero_emergencia.findUnique({ where: { id: tipoId } });
    if (!tipo) throw new BadRequestException(`El tipo con ID "${tipoId}" no existe.`);
  }

  async validateAdminExists(adminId: string): Promise<void> {
    const admin = await this.databaseService.admin_users.findUnique({ where: { id: adminId } });
    if (!admin) throw new BadRequestException(`El administrador con ID "${adminId}" no existe.`);
  }

  validateVerificadoConsistency(verificado?: boolean, verificadoPor?: string | null): void {
    if (verificado === true && !verificadoPor) {
      throw new BadRequestException('Si está marcado como verificado, debe indicar quién lo verificó (verificado_por).');
    }
    if (verificado === false && verificadoPor) {
      throw new BadRequestException('No se puede asignar un verificador si no está marcado como verificado.');
    }
  }

  async create(dto: CreateNumeroEmergenciaDto) {
    const { estado_id, ciudad_id, tipo_id, verificado, verificado_por } = dto;

    if (estado_id) await this.validateEstadoExists(estado_id);
    if (ciudad_id) await this.validateCiudadExists(ciudad_id);
    if (tipo_id) await this.validateTipoExists(tipo_id);
    if (verificado_por) await this.validateAdminExists(verificado_por);
    this.validateVerificadoConsistency(verificado, verificado_por);

    try {
      const entity = await this.databaseService.numeros_emergencia.create({
        data: dto as Prisma.numeros_emergenciaCreateInput,
        include: { estados: true, ciudades: true, tipos_numero_emergencia: true },
      });

      return NumeroEmergenciaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationNumeroEmergenciaDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, estado_id, ciudad_id, tipo_id } = paginationDto;

    const where: Prisma.numeros_emergenciaWhereInput = {
      ...(estado_id && { estado_id }),
      ...(ciudad_id && { ciudad_id }),
      ...(tipo_id && { tipo_id }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { numero: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.numeros_emergencia.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
        include: { estados: true, ciudades: true, tipos_numero_emergencia: true },
      }),
      this.databaseService.numeros_emergencia.count({ where }),
    ]);

    const data = NumeroEmergenciaMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.numeros_emergencia.findUnique({
      where: { id },
      include: { estados: true, ciudades: true, tipos_numero_emergencia: true },
    });

    if (!entity) {
      throw new NotFoundException(`Número de emergencia con ID "${id}" no encontrado.`);
    }

    return NumeroEmergenciaMapper.toResponse(entity);
  }

  async update(id: string, dto: UpdateNumeroEmergenciaDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.numeros_emergencia.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Número de emergencia con ID "${id}" no encontrado.`);

    const { estado_id, ciudad_id, tipo_id, verificado, verificado_por } = dto;

    if (estado_id) await this.validateEstadoExists(estado_id);
    if (ciudad_id) await this.validateCiudadExists(ciudad_id);
    if (tipo_id) await this.validateTipoExists(tipo_id);
    if (verificado_por) await this.validateAdminExists(verificado_por);

    const finalVerificado = verificado ?? existing.verificado;
    const finalVerificadoPor = verificado_por !== undefined ? verificado_por : existing.verificado_por;
    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    try {
      const entity = await this.databaseService.numeros_emergencia.update({
        where: { id },
        data: dto as Prisma.numeros_emergenciaUpdateInput,
        include: { estados: true, ciudades: true, tipos_numero_emergencia: true },
      });

      return NumeroEmergenciaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.numeros_emergencia.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Número de emergencia con ID "${id}" no encontrado.`);

    try {
      await this.databaseService.numeros_emergencia.delete({ where: { id } });
      return { message: 'Número de emergencia eliminado correctamente.' };
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(`Ya existe un registro duplicado en: ${fields}.`);
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(`Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`);
        }
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el recurso (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
