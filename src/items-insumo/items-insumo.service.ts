import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateItemInsumoDto } from './dto/create-item-insumo.dto';
import { UpdateItemInsumoDto } from './dto/update-item-insumo.dto';
import { PaginationItemInsumoDto } from './dto/pagination-item-insumo.dto';
import { ItemInsumoMapper } from './mappers/item-insumo.mapper';

@Injectable()
export class ItemsInsumoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateCategoriaExists(categoriaId: string): Promise<void> {
    const categoria = await this.databaseService.categorias_insumos.findUnique({ where: { id: categoriaId } });
    if (!categoria) {
      throw new BadRequestException(`La categoría con ID "${categoriaId}" no existe.`);
    }
  }

  async create(dto: CreateItemInsumoDto) {
    await this.validateCategoriaExists(dto.categoria_id);

    try {
      const entity = await this.databaseService.items_insumo.create({
        data: dto,
        include: { categorias_insumos: true },
      });

      return ItemInsumoMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationItemInsumoDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, categoria_id } = paginationDto;

    const where: Prisma.items_insumoWhereInput = {
      ...(categoria_id && { categoria_id }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
          { categorias_insumos: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.items_insumo.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
        include: { categorias_insumos: true },
      }),
      this.databaseService.items_insumo.count({ where }),
    ]);

    const data = ItemInsumoMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.items_insumo.findUnique({
      where: { id },
      include: { categorias_insumos: true },
    });

    if (!entity) {
      throw new NotFoundException(`Item de insumo con ID "${id}" no encontrado.`);
    }

    return ItemInsumoMapper.toResponse(entity);
  }

  async update(id: string, dto: UpdateItemInsumoDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.items_insumo.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Item de insumo con ID "${id}" no encontrado.`);

    if (dto.categoria_id) await this.validateCategoriaExists(dto.categoria_id);

    try {
      const entity = await this.databaseService.items_insumo.update({
        where: { id },
        data: dto,
        include: { categorias_insumos: true },
      });

      return ItemInsumoMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.items_insumo.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Item de insumo con ID "${id}" no encontrado.`);

    try {
      await this.databaseService.items_insumo.delete({ where: { id } });
      return { message: 'Item de insumo eliminado correctamente.' };
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
          throw new BadRequestException(`Error de base de datos al ${operacion} el item (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
