import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateTipoNumeroEmergenciaDto } from './dto/create-tipo-numero-emergencia.dto';
import { UpdateTipoNumeroEmergenciaDto } from './dto/update-tipo-numero-emergencia.dto';
import { PaginationTipoNumeroEmergenciaDto } from './dto/pagination-tipo-numero-emergencia.dto';
import { TipoNumeroEmergenciaMapper } from './mappers/tipo-numero-emergencia.mapper';

@Injectable()
export class TiposNumeroEmergenciaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateSlugUnico(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.databaseService.tipos_numero_emergencia.findFirst({
      where: {
        slug: { equals: slug, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un tipo con el slug "${slug}".`);
    }
  }

  async create(dto: CreateTipoNumeroEmergenciaDto) {
    await this.validateSlugUnico(dto.slug);

    try {
      const entity = await this.databaseService.tipos_numero_emergencia.create({ data: dto });
      return TipoNumeroEmergenciaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationTipoNumeroEmergenciaDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search } = paginationDto;

    const where: Prisma.tipos_numero_emergenciaWhereInput = {
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.tipos_numero_emergencia.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      }),
      this.databaseService.tipos_numero_emergencia.count({ where }),
    ]);

    const data = TipoNumeroEmergenciaMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.tipos_numero_emergencia.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException(`Tipo con ID "${id}" no encontrado.`);
    return TipoNumeroEmergenciaMapper.toResponse(entity);
  }

  async update(id: string, dto: UpdateTipoNumeroEmergenciaDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.tipos_numero_emergencia.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Tipo con ID "${id}" no encontrado.`);

    if (dto.slug) await this.validateSlugUnico(dto.slug, id);

    try {
      const entity = await this.databaseService.tipos_numero_emergencia.update({
        where: { id },
        data: dto,
      });
      return TipoNumeroEmergenciaMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.tipos_numero_emergencia.findUnique({
      where: { id },
      include: { _count: { select: { numeros_emergencia: true } } },
    });

    if (!existing) throw new NotFoundException(`Tipo con ID "${id}" no encontrado.`);

    if (existing._count.numeros_emergencia > 0) {
      throw new BadRequestException(
        `No se puede eliminar el tipo porque tiene ${existing._count.numeros_emergencia} número(s) de emergencia asociados.`,
      );
    }

    try {
      await this.databaseService.tipos_numero_emergencia.delete({ where: { id } });
      return { message: 'Tipo de número de emergencia eliminado correctamente.' };
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
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el tipo (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
