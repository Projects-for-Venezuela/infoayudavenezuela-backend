import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateNecesidadUrgenteDto } from './dto/create-necesidad-urgente.dto';
import { UpdateNecesidadUrgenteDto } from './dto/update-necesidad-urgente.dto';
import { PaginationNecesidadUrgenteDto } from './dto/pagination-necesidad-urgente.dto';
import { NecesidadUrgenteMapper } from './mappers/necesidad-urgente.mapper';

@Injectable()
export class NecesidadesUrgentesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateEstadoExists(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({ where: { id: estadoId } });
    if (!estado) throw new BadRequestException(`El estado con ID "${estadoId}" no existe.`);
  }

  async validateCiudadEnEstado(ciudadId: string, estadoId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudadId } });
    if (!ciudad) throw new BadRequestException(`La ciudad con ID "${ciudadId}" no existe.`);
    if (ciudad.estado_id !== estadoId) {
      throw new BadRequestException('La ciudad no pertenece al estado seleccionado.');
    }
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

  async create(dto: CreateNecesidadUrgenteDto) {
    const { estado_id, ciudad_id, verificado, verificado_por } = dto;

    await this.validateEstadoExists(estado_id);
    await this.validateCiudadEnEstado(ciudad_id, estado_id);
    if (verificado_por) await this.validateAdminExists(verificado_por);
    this.validateVerificadoConsistency(verificado, verificado_por);

    try {
      const entity = await this.databaseService.necesidades_urgentes.create({
        data: dto as unknown as Prisma.necesidades_urgentesCreateInput,
        include: { ciudades: true, estados: true },
      });

      return NecesidadUrgenteMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationNecesidadUrgenteDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, estado_id, ciudad_id, verificado } = paginationDto;

    const where: Prisma.necesidades_urgentesWhereInput = {
      ...(estado_id && { estado_id }),
      ...(ciudad_id && { ciudad_id }),
      ...(verificado !== undefined && { verificado }),
      ...(search && {
        OR: [
          { lugar: { contains: search, mode: 'insensitive' } },
          { que_necesitan: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.necesidades_urgentes.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { ciudades: true, estados: true },
      }),
      this.databaseService.necesidades_urgentes.count({ where }),
    ]);

    const data = NecesidadUrgenteMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.necesidades_urgentes.findUnique({
      where: { id },
      include: { ciudades: true, estados: true },
    });

    if (!entity) {
      throw new NotFoundException(`Necesidad urgente con ID "${id}" no encontrada.`);
    }

    return NecesidadUrgenteMapper.toResponse(entity);
  }

  async update(id: string, dto: UpdateNecesidadUrgenteDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.necesidades_urgentes.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Necesidad urgente con ID "${id}" no encontrada.`);

    const { estado_id, ciudad_id, verificado, verificado_por } = dto;

    if (estado_id) await this.validateEstadoExists(estado_id);

    const finalEstadoId = estado_id ?? existing.estado_id;
    const finalCiudadId = ciudad_id ?? existing.ciudad_id;

    if (ciudad_id || estado_id) await this.validateCiudadEnEstado(finalCiudadId, finalEstadoId);
    if (verificado_por) await this.validateAdminExists(verificado_por);

    const finalVerificado = verificado ?? existing.verificado;
    const finalVerificadoPor = verificado_por !== undefined ? verificado_por : existing.verificado_por;
    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    try {
      const entity = await this.databaseService.necesidades_urgentes.update({
        where: { id },
        data: dto as Prisma.necesidades_urgentesUpdateInput,
        include: { ciudades: true, estados: true },
      });

      return NecesidadUrgenteMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.necesidades_urgentes.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Necesidad urgente con ID "${id}" no encontrada.`);

    try {
      await this.databaseService.necesidades_urgentes.delete({ where: { id } });
      return { message: 'Necesidad urgente eliminada correctamente.' };
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
