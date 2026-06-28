import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateInsumoGeneralDto } from './dto/create-insumo-general.dto';
import { UpdateInsumoGeneralDto } from './dto/update-insumo-general.dto';
import { PaginationInsumoGeneralDto } from './dto/pagination-insumo-general.dto';
import { InsumoGeneralMapper } from './mappers/insumo-general.mapper';

@Injectable()
export class InsumosGeneralesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateInsumoGeneralDto) {
    try {
      const entity = await this.databaseService.insumos_generales.create({ data: dto });
      return InsumoGeneralMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationInsumoGeneralDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search } = paginationDto;

    const where: Prisma.insumos_generalesWhereInput = {
      ...(search && {
        nombre: { contains: search, mode: 'insensitive' },
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.insumos_generales.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      }),
      this.databaseService.insumos_generales.count({ where }),
    ]);

    const data = InsumoGeneralMapper.toResponseList(items);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const entity = await this.databaseService.insumos_generales.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException(`Insumo general con ID "${id}" no encontrado.`);
    return InsumoGeneralMapper.toResponse(entity);
  }

  async update(id: string, dto: UpdateInsumoGeneralDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.insumos_generales.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Insumo general con ID "${id}" no encontrado.`);

    try {
      const entity = await this.databaseService.insumos_generales.update({
        where: { id },
        data: dto,
      });
      return InsumoGeneralMapper.toResponse(entity);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.insumos_generales.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Insumo general con ID "${id}" no encontrado.`);

    try {
      await this.databaseService.insumos_generales.delete({ where: { id } });
      return { message: 'Insumo general eliminado correctamente.' };
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el insumo (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
