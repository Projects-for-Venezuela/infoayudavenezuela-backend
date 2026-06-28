import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateEstadoAliasDto } from './dto/create-estado-alias.dto';
import { UpdateEstadoAliasDto } from './dto/update-estado-alias.dto';
import { PaginationEstadoAliasDto } from './dto/pagination-estado-alias.dto';
import { EstadoAliasMapper } from './mappers/estado-alias.mapper';

@Injectable()
export class EstadosAliasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateAliasUnico(alias: string, excludeId?: string): Promise<void> {
    const existing = await this.databaseService.estados_alias.findFirst({
      where: {
        alias: { equals: alias, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un alias con el nombre "${alias}".`);
    }
  }

  async validateEstado(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({ where: { id: estadoId } });
    if (!estado) {
      throw new BadRequestException(`El estado con ID "${estadoId}" no existe.`);
    }
  }

  async create(dto: CreateEstadoAliasDto) {
    await this.validateAliasUnico(dto.alias);
    await this.validateEstado(dto.estado_id);

    try {
      const entity = await this.databaseService.estados_alias.create({
        data: dto,
      });

      return EstadoAliasMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationEstadoAliasDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, estado_id } = paginationDto;

    const where: Prisma.estados_aliasWhereInput = {
      ...(search && {
        alias: { contains: search, mode: 'insensitive' },
      }),
      ...(estado_id && { estado_id }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.estados_alias.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { alias: 'asc' },
      }),
      this.databaseService.estados_alias.count({ where }),
    ]);

    const data = EstadoAliasMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.estados_alias.findUnique({
      where: { id },
      include: { estados: true },
    });

    if (!entity) {
      throw new NotFoundException(`Alias con ID "${id}" no encontrado.`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateEstadoAliasDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.estados_alias.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Alias con ID "${id}" no encontrado.`);

    if (dto.alias) await this.validateAliasUnico(dto.alias, id);
    if (dto.estado_id) await this.validateEstado(dto.estado_id);

    try {
      const entity = await this.databaseService.estados_alias.update({
        where: { id },
        data: dto,
      });

      return EstadoAliasMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.estados_alias.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Alias con ID "${id}" no encontrado.`);

    try {
      await this.databaseService.estados_alias.delete({ where: { id } });
      return { message: 'Alias eliminado correctamente.' };
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
        case 'P2003':
          throw new BadRequestException(`El estado asociado no existe.`);
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el alias (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
