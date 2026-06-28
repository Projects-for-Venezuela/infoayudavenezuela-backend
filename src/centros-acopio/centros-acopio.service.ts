import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCentrosAcopioDto } from './dto/update-centros-acopio.dto';
import { DatabaseService } from '~/database/database.service';
import { PaginationCentrosAcopioDto } from '~/centros-acopio/dto/pagination-centros-acopio.dto';
import { centros_acopio, Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CentroAcopioMapper } from '~/centros-acopio/mappers/centro-acopio.mapper';
import { ResponseHelper } from '~/common/response/response.helper';
import { CreateCentroAcopioDto } from '~/centros-acopio/dto/create-centros-acopio.dto';

@Injectable()
export class CentrosAcopioService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createCentroAcopioDto: CreateCentroAcopioDto,
  ): Promise<ResponseHelper<centros_acopio>> {
    const estado = await this.databaseService.estados.findUnique({
      where: { id: createCentroAcopioDto.estado_id },
    });

    if (!estado) throw new NotFoundException('El estado seleccionado no existe.');

    const ciudad = await this.databaseService.ciudades.findUnique({
      where: { id: createCentroAcopioDto.ciudad_id },
    });

    if (!ciudad) throw new NotFoundException('La ciudad seleccionada no existe.');

    if (ciudad.estado_id !== estado.id)
      throw new NotFoundException('La ciudad seleccionada no pertenece al estado seleccionado.');

    const existingCentroAcopio = await this.databaseService.centros_acopio.findFirst({
      where: {
        nombre: { equals: createCentroAcopioDto.nombre, mode: 'insensitive' },
        ciudad_id: createCentroAcopioDto.ciudad_id,
      },
    });

    if (existingCentroAcopio)
      throw new ConflictException('Ya existe un centro de acopio con ese nombre en esta ciudad.');

    await this.databaseService.centros_acopio.create({
      data: { ...createCentroAcopioDto, verificado: false },
      include: { ciudades: true, estados: true },
    });

    return new ResponseHelper('Centro de acopio creado correctamente.');
  }

  async pagination(paginationCentrosAcopioDto: PaginationCentrosAcopioDto) {
    const page = paginationCentrosAcopioDto.page ?? 1;
    const limit = paginationCentrosAcopioDto.limit ?? 20;

    const { search, state, ciudad } = paginationCentrosAcopioDto;

    const where: Prisma.centros_acopioWhereInput = {
      ...(state && { estados: { nombre: { contains: state, mode: 'insensitive' } } }),
      ...(ciudad && { ciudades: { nombre: { contains: ciudad, mode: 'insensitive' } } }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { direccion: { contains: search, mode: 'insensitive' } },
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

    const response = CentroAcopioMapper.toResponseList(centrosAcopio);

    return PaginationHelper.build(response, total, page, limit);
  }

  async findOne(id: string): Promise<ResponseHelper<centros_acopio>> {
    const centro = await this.databaseService.centros_acopio.findUnique({
      where: { id },
      include: { ciudades: true, estados: true },
    });

    if (!centro) throw new NotFoundException(`Centro de acopio con ID ${id} no encontrado`);

    return new ResponseHelper('Centro de acopio encontrado', centro);
  }

  async update(
    id: string,
    updateCentroAcopioDto: UpdateCentrosAcopioDto,
  ): Promise<ResponseHelper<centros_acopio>> {
    const centroAcopio = await this.databaseService.centros_acopio.findUnique({ where: { id } });

    if (!centroAcopio) throw new NotFoundException('Centro de acopio no encontrado.');

    if (updateCentroAcopioDto.estado_id && updateCentroAcopioDto.ciudad_id) {
      const ciudad = await this.databaseService.ciudades.findFirst({
        where: { id: updateCentroAcopioDto.ciudad_id, estado_id: updateCentroAcopioDto.estado_id },
      });

      if (!ciudad)
        throw new BadRequestException('La ciudad no pertenece al estado seleccionado o no existe.');
    }

    if (updateCentroAcopioDto.nombre && updateCentroAcopioDto.ciudad_id) {
      const existing = await this.databaseService.centros_acopio.findFirst({
        where: {
          nombre: { equals: updateCentroAcopioDto.nombre, mode: 'insensitive' },
          ciudad_id: updateCentroAcopioDto.ciudad_id,
          NOT: { id },
        },
      });

      if (existing)
        throw new ConflictException('Ya existe un centro de acopio con ese nombre en esta ciudad.');
    }

    const centro = await this.databaseService.centros_acopio.update({
      where: { id },
      data: updateCentroAcopioDto,
      include: { ciudades: true, estados: true },
    });

    return new ResponseHelper('Centro de acopio actualizado correctamente.', centro);
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const centroAcopio = await this.databaseService.centros_acopio.findUnique({ where: { id } });

    if (!centroAcopio) throw new NotFoundException('Centro de acopio no encontrado.');

    await this.databaseService.centros_acopio.delete({ where: { id } });

    return new ResponseHelper('Centro de acopio eliminado correctamente.');
  }
}
