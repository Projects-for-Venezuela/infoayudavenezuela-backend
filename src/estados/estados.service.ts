import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PaginationEstadoDto } from './dto/pagination-estado.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';

@Injectable()
export class EstadosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Verifica que no exista otro estado con el mismo nombre (case-insensitive).
   */
  async validateNombreUnico(nombre: string, excludeId?: string): Promise<void> {
    const existing = await this.databaseService.estados.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe un estado con el nombre "${existing.nombre}". No se permiten nombres duplicados.`,
      );
    }
  }

  async create(createEstadoDto: CreateEstadoDto) {
    await this.validateNombreUnico(createEstadoDto.nombre);

    try {
      return await this.databaseService.estados.create({
        data: createEstadoDto,
        include: {
          ciudades: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationEstadoDto: PaginationEstadoDto) {
    const page = paginationEstadoDto.page ?? 1;
    const limit = paginationEstadoDto.limit ?? 20;
    const { search, include_ciudad: includeCiudad, include_refugios: includeRefugios } = paginationEstadoDto;

    const where: Prisma.estadosWhereInput = {
      ...(search && {
        nombre: { contains: search, mode: 'insensitive' },
      }),
    };

    const [estados, total] = await this.databaseService.$transaction([
      this.databaseService.estados.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          ...(includeCiudad && {
            ciudades: {
              select: { id: true, nombre: true },
              orderBy: { nombre: 'asc' },
            },
          }),
          ...(includeRefugios && {
            refugios: {
              select: { id: true, nombre: true },
              orderBy: { nombre: 'asc' },
            },
          }),
          _count: {
            select: { ciudades: true, refugios: true },
          },
        },
      }),
      this.databaseService.estados.count({ where }),
    ]);

    return PaginationHelper.build(estados, total, page, limit);
  }

  async findOne(id: string, queryDto?: { include_ciudad?: boolean; include_refugios?: boolean }) {
    const { include_ciudad: includeCiudad, include_refugios: includeRefugios } = queryDto ?? {};

    const estado = await this.databaseService.estados.findUnique({
      where: { id },
      include: {
        ...(includeCiudad && {
          ciudades: {
            select: { id: true, nombre: true },
            orderBy: { nombre: 'asc' },
          },
        }),
        ...(includeRefugios && {
          refugios: {
            select: { id: true, nombre: true },
            orderBy: { nombre: 'asc' },
          },
        }),
        _count: {
          select: {
            refugios: true,
            centros_acopio: true,
            pacientes: true,
          },
        },
      },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID "${id}" no encontrado.`);
    }

    return estado;
  }

  async update(id: string, updateEstadoDto: UpdateEstadoDto) {
    if (Object.keys(updateEstadoDto).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    await this.findOne(id);

    if (updateEstadoDto.nombre) {
      await this.validateNombreUnico(updateEstadoDto.nombre, id);
    }

    try {
      return await this.databaseService.estados.update({
        where: { id },
        data: updateEstadoDto,
        include: {
          ciudades: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const estado = await this.databaseService.estados.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ciudades: true,
            refugios: true,
            centros_acopio: true,
            pacientes: true,
            numeros_emergencia: true,
            necesidades_urgentes: true,
            noticias: true,
          },
        },
      },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID "${id}" no encontrado.`);
    }

    const dependencias: string[] = [];
    if (estado._count.ciudades > 0) dependencias.push(`${estado._count.ciudades} ciudad(es)`);
    if (estado._count.refugios > 0) dependencias.push(`${estado._count.refugios} refugio(s)`);
    if (estado._count.centros_acopio > 0) dependencias.push(`${estado._count.centros_acopio} centro(s) de acopio`);
    if (estado._count.pacientes > 0) dependencias.push(`${estado._count.pacientes} paciente(s)`);
    if (estado._count.numeros_emergencia > 0) dependencias.push(`${estado._count.numeros_emergencia} número(s) de emergencia`);
    if (estado._count.necesidades_urgentes > 0) dependencias.push(`${estado._count.necesidades_urgentes} necesidad(es) urgente(s)`);
    if (estado._count.noticias > 0) dependencias.push(`${estado._count.noticias} noticia(s)`);

    if (dependencias.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el estado "${estado.nombre}" porque tiene registros asociados: ${dependencias.join(', ')}. ` +
          `Debe eliminar o reasignar estos registros antes de eliminar el estado.`,
      );
    }

    try {
      return await this.databaseService.estados.delete({
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
            `Ya existe un estado con los mismos valores en: ${fields}. No se permiten duplicados.`,
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
            `Error de base de datos al ${operacion} el estado (código: ${error.code}).`,
          );
      }
    }

    throw error;
  }
}
