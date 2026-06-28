import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { PaginationCiudadDto } from './dto/pagination-ciudad.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';

@Injectable()
export class CiudadesService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Valida que el estado exista en la base de datos.
   */
  async validateEstado(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({
      where: { id: estadoId },
    });

    if (!estado) {
      throw new BadRequestException(
        `El estado con ID "${estadoId}" no existe. Verifique el estado_id proporcionado.`,
      );
    }
  }

  /**
   * Verifica que no exista otra ciudad con el mismo nombre en el mismo estado.
   */
  async validateNombreUnicoEnEstado(
    nombre: string,
    estadoId: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.databaseService.ciudades.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        estado_id: estadoId,
        ...(excludeId && { id: { not: excludeId } }),
      },
      include: { estados: true },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe una ciudad con el nombre "${existing.nombre}" en el estado "${existing.estados.nombre}". ` +
          `No se permiten ciudades duplicadas dentro del mismo estado.`,
      );
    }
  }

  async create(createCiudadDto: CreateCiudadDto) {
    await this.validateEstado(createCiudadDto.estado_id);
    await this.validateNombreUnicoEnEstado(createCiudadDto.nombre, createCiudadDto.estado_id);

    try {
      return await this.databaseService.ciudades.create({
        data: createCiudadDto,
        include: {
          estados: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationCiudadDto: PaginationCiudadDto) {
    const page = paginationCiudadDto.page ?? 1;
    const limit = paginationCiudadDto.limit ?? 20;
    const { search, estado_id } = paginationCiudadDto;

    const where: Prisma.ciudadesWhereInput = {
      ...(estado_id && { estado_id }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { estados: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [ciudades, total] = await this.databaseService.$transaction([
      this.databaseService.ciudades.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          estados: true,
          _count: {
            select: { refugios: true, centros_acopio: true },
          },
        },
      }),
      this.databaseService.ciudades.count({ where }),
    ]);

    return PaginationHelper.build(ciudades, total, page, limit);
  }

  async findOne(id: string) {
    const ciudad = await this.databaseService.ciudades.findUnique({
      where: { id },
      include: {
        estados: true,
        _count: {
          select: {
            refugios: true,
            centros_acopio: true,
            hospitales: true,
            pacientes: true,
          },
        },
      },
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID "${id}" no encontrada.`);
    }

    return ciudad;
  }

  async update(id: string, updateCiudadDto: UpdateCiudadDto) {
    if (Object.keys(updateCiudadDto).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    const existingCiudad = await this.findOne(id);

    // Si se cambia el estado, verificar que el nuevo estado exista
    if (updateCiudadDto.estado_id) {
      await this.validateEstado(updateCiudadDto.estado_id);
    }

    // Verificar duplicado nombre+estado con los valores finales
    const finalNombre = updateCiudadDto.nombre ?? existingCiudad.nombre;
    const finalEstadoId = updateCiudadDto.estado_id ?? existingCiudad.estado_id;

    if (updateCiudadDto.nombre || updateCiudadDto.estado_id) {
      await this.validateNombreUnicoEnEstado(finalNombre, finalEstadoId, id);
    }

    try {
      return await this.databaseService.ciudades.update({
        where: { id },
        data: updateCiudadDto,
        include: {
          estados: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const ciudad = await this.databaseService.ciudades.findUnique({
      where: { id },
      include: {
        estados: true,
        _count: {
          select: {
            refugios: true,
            centros_acopio: true,
            hospitales: true,
            pacientes: true,
            necesidades_urgentes: true,
            noticias: true,
            numeros_emergencia: true,
          },
        },
      },
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID "${id}" no encontrada.`);
    }

    const dependencias: string[] = [];
    if (ciudad._count.refugios > 0) dependencias.push(`${ciudad._count.refugios} refugio(s)`);
    if (ciudad._count.centros_acopio > 0) dependencias.push(`${ciudad._count.centros_acopio} centro(s) de acopio`);
    if (ciudad._count.hospitales > 0) dependencias.push(`${ciudad._count.hospitales} hospital(es)`);
    if (ciudad._count.pacientes > 0) dependencias.push(`${ciudad._count.pacientes} paciente(s)`);
    if (ciudad._count.necesidades_urgentes > 0) dependencias.push(`${ciudad._count.necesidades_urgentes} necesidad(es) urgente(s)`);
    if (ciudad._count.noticias > 0) dependencias.push(`${ciudad._count.noticias} noticia(s)`);
    if (ciudad._count.numeros_emergencia > 0) dependencias.push(`${ciudad._count.numeros_emergencia} número(s) de emergencia`);

    if (dependencias.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la ciudad "${ciudad.nombre}" (${ciudad.estados.nombre}) porque tiene registros asociados: ` +
          `${dependencias.join(', ')}. Debe eliminar o reasignar estos registros antes de eliminar la ciudad.`,
      );
    }

    try {
      return await this.databaseService.ciudades.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  /**
   * Maneja errores de Prisma y los traduce a excepciones HTTP descriptivas.
   */
  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(
            `Ya existe una ciudad con los mismos valores en: ${fields}. No se permiten duplicados.`,
          );
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(
            `Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`,
          );
        }
        case 'P2025':
          throw new NotFoundException(
            `No se encontró el registro que se intentó ${operacion}.`,
          );
        default:
          throw new BadRequestException(
            `Error de base de datos al ${operacion} la ciudad (código: ${error.code}).`,
          );
      }
    }

    throw error;
  }
}
