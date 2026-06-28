import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateCategoriaInsumoDto } from './dto/create-categoria-insumo.dto';
import { UpdateCategoriaInsumoDto } from './dto/update-categoria-insumo.dto';
import { PaginationCategoriaInsumoDto } from './dto/pagination-categoria-insumo.dto';
import { CategoriaInsumoMapper } from './mappers/categoria-insumo.mapper';

@Injectable()
export class CategoriasInsumosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateSlugUnico(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.databaseService.categorias_insumos.findFirst({
      where: {
        slug: { equals: slug, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException(`Ya existe una categoría con el slug "${slug}".`);
    }
  }

  async create(dto: CreateCategoriaInsumoDto) {
    await this.validateSlugUnico(dto.slug);

    try {
      const entity = await this.databaseService.categorias_insumos.create({
        data: dto,
      });

      return CategoriaInsumoMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationCategoriaInsumoDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search } = paginationDto;

    const where: Prisma.categorias_insumosWhereInput = {
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.categorias_insumos.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.databaseService.categorias_insumos.count({ where }),
    ]);

    const data = CategoriaInsumoMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.categorias_insumos.findUnique({
      where: { id },
      include: { items_insumo: { orderBy: { orden: 'asc' } } },
    });

    if (!entity) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada.`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateCategoriaInsumoDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.categorias_insumos.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Categoría con ID "${id}" no encontrada.`);

    if (dto.slug) await this.validateSlugUnico(dto.slug, id);

    try {
      const entity = await this.databaseService.categorias_insumos.update({
        where: { id },
        data: dto,
      });

      return CategoriaInsumoMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.categorias_insumos.findUnique({
      where: { id },
      include: { _count: { select: { items_insumo: true } } },
    });

    if (!existing) throw new NotFoundException(`Categoría con ID "${id}" no encontrada.`);

    if (existing._count.items_insumo > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría porque tiene ${existing._count.items_insumo} item(s) de insumo asociados.`,
      );
    }

    try {
      await this.databaseService.categorias_insumos.delete({ where: { id } });
      return { message: 'Categoría de insumo eliminada correctamente.' };
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
          throw new BadRequestException(`Error de base de datos al ${operacion} la categoría (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
