import { Injectable } from '@nestjs/common';
import { CreateCentrosAcopioDto } from './dto/create-centros-acopio.dto';
import { UpdateCentrosAcopioDto } from './dto/update-centros-acopio.dto';
import { DatabaseService } from '../database/database.service';
import { PaginationCentrosAcopioDto } from '~/centros-acopio/dto/pagination-centros-acopio.dto';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';

@Injectable()
export class CentrosAcopioService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createCentrosAcopioDto: CreateCentrosAcopioDto) {
    return 'This action adds a new centrosAcopio';
  }

  async pagination(paginationCentrosAcopioDto: PaginationCentrosAcopioDto) {
    const page = paginationCentrosAcopioDto.page ?? 1;
    const limit = paginationCentrosAcopioDto.limit ?? 20;
    const { search, state } = paginationCentrosAcopioDto;

    const where: Prisma.centros_acopioWhereInput = {
      ...(state && {
        estados: { nombre: { contains: state, mode: 'insensitive' } },
      }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { ciudades: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [centrosAcopio, total] = await this.databaseService.$transaction([
      this.databaseService.centros_acopio.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { ciudades: true, estados: true },
      }),
      this.databaseService.centros_acopio.count({ where }),
    ]);

    return PaginationHelper.build(centrosAcopio, total, page, limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} centrosAcopio`;
  }

  update(id: number, updateCentrosAcopioDto: UpdateCentrosAcopioDto) {
    return `This action updates a #${id} centrosAcopio`;
  }

  remove(id: number) {
    return `This action removes a #${id} centrosAcopio`;
  }
}
