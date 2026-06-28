import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { PaginationHospitalDto } from './dto/pagination-hospital.dto';
import { HospitalMapper } from './mappers/hospital.mapper';

@Injectable()
export class HospitalesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateCiudadExists(ciudadId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudadId } });
    if (!ciudad) {
      throw new BadRequestException(`La ciudad con ID "${ciudadId}" no existe.`);
    }
  }

  async validateNombreUnicoEnCiudad(nombre: string, ciudadId: string, excludeId?: string): Promise<void> {
    const existing = await this.databaseService.hospitales.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        ciudad_id: ciudadId,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un hospital con el nombre "${nombre}" en esta ciudad.`);
    }
  }

  async create(createHospitalDto: CreateHospitalDto) {
    await this.validateCiudadExists(createHospitalDto.ciudad_id);
    await this.validateNombreUnicoEnCiudad(createHospitalDto.nombre, createHospitalDto.ciudad_id);

    try {
      const hospital = await this.databaseService.hospitales.create({
        data: createHospitalDto,
        include: { ciudades: true },
      });

      return HospitalMapper.toResponse(hospital);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationHospitalDto: PaginationHospitalDto) {
    const page = paginationHospitalDto.page ?? 1;
    const limit = paginationHospitalDto.limit ?? 20;
    const { search } = paginationHospitalDto;

    const where: Prisma.hospitalesWhereInput = {
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { ciudades: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [hospitales, total] = await this.databaseService.$transaction([
      this.databaseService.hospitales.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: { ciudades: true },
      }),
      this.databaseService.hospitales.count({ where }),
    ]);

    const data = HospitalMapper.toResponseList(hospitales);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const hospital = await this.databaseService.hospitales.findUnique({
      where: { id },
      include: { ciudades: true },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital con ID "${id}" no encontrado.`);
    }

    return HospitalMapper.toResponse(hospital);
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto) {
    if (Object.keys(updateHospitalDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.hospitales.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Hospital con ID "${id}" no encontrado.`);
    }

    if (updateHospitalDto.ciudad_id) {
      await this.validateCiudadExists(updateHospitalDto.ciudad_id);
    }

    const finalNombre = updateHospitalDto.nombre ?? existing.nombre;
    const finalCiudadId = updateHospitalDto.ciudad_id ?? existing.ciudad_id;

    if (updateHospitalDto.nombre || updateHospitalDto.ciudad_id) {
      await this.validateNombreUnicoEnCiudad(finalNombre, finalCiudadId, id);
    }

    try {
      const hospital = await this.databaseService.hospitales.update({
        where: { id },
        data: updateHospitalDto,
        include: { ciudades: true },
      });

      return HospitalMapper.toResponse(hospital);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.hospitales.findUnique({
      where: { id },
      include: {
        _count: { select: { pacientes: true } },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Hospital con ID "${id}" no encontrado.`);
    }

    if (existing._count.pacientes > 0) {
      throw new BadRequestException(
        `No se puede eliminar el hospital porque tiene ${existing._count.pacientes} paciente(s) asociado(s).`,
      );
    }

    try {
      await this.databaseService.hospitales.delete({ where: { id } });
      return { message: 'Hospital eliminado correctamente.' };
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(`Ya existe un hospital duplicado en: ${fields}.`);
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(`Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`);
        }
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el hospital (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
