import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateEstadosAyudaDto } from './dto/create-estados-ayuda.dto';
import { UpdateEstadosAyudaDto } from './dto/update-estados-ayuda.dto';
import { PaginationEstadosAyudaDto } from './dto/pagination-estados-ayuda.dto';
import { EstadosAyudaMapper } from './mappers/estados-ayuda.mapper';

@Injectable()
export class EstadosAyudaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateEstado(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({ where: { id: estadoId } });
    if (!estado) {
      throw new BadRequestException(`El estado con ID "${estadoId}" no existe.`);
    }
  }

  async validateNoDuplicado(estadoId: string): Promise<void> {
    const existing = await this.databaseService.estados_ayuda.findUnique({
      where: { estado_id: estadoId },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un registro de ayuda para el estado con ID "${estadoId}".`);
    }
  }

  async create(dto: CreateEstadosAyudaDto) {
    await this.validateEstado(dto.estado_id);
    await this.validateNoDuplicado(dto.estado_id);

    try {
      const entity = await this.databaseService.estados_ayuda.create({
        data: dto,
      });

      return EstadosAyudaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationEstadosAyudaDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, estado_id } = paginationDto;

    const where: Prisma.estados_ayudaWhereInput = {
      ...(search && {
        nivel_ayuda: { contains: search, mode: 'insensitive' },
      }),
      ...(estado_id && { estado_id }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.estados_ayuda.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updated_at: 'desc' },
      }),
      this.databaseService.estados_ayuda.count({ where }),
    ]);

    const data = EstadosAyudaMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(estadoId: string) {
    const entity = await this.databaseService.estados_ayuda.findUnique({
      where: { estado_id: estadoId },
      include: { estados: true },
    });

    if (!entity) {
      throw new NotFoundException(`Registro de ayuda para el estado ID "${estadoId}" no encontrado.`);
    }

    return entity;
  }

  async update(estadoId: string, dto: UpdateEstadosAyudaDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.estados_ayuda.findUnique({
      where: { estado_id: estadoId },
    });
    if (!existing) {
      throw new NotFoundException(`Registro de ayuda para el estado ID "${estadoId}" no encontrado.`);
    }

    try {
      const entity = await this.databaseService.estados_ayuda.update({
        where: { estado_id: estadoId },
        data: dto,
      });

      return EstadosAyudaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(estadoId: string) {
    const existing = await this.databaseService.estados_ayuda.findUnique({
      where: { estado_id: estadoId },
    });
    if (!existing) {
      throw new NotFoundException(`Registro de ayuda para el estado ID "${estadoId}" no encontrado.`);
    }

    try {
      await this.databaseService.estados_ayuda.delete({
        where: { estado_id: estadoId },
      });
      return { message: 'Registro de ayuda eliminado correctamente.' };
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
          throw new BadRequestException(`Error de base de datos al ${operacion} el registro de ayuda (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
