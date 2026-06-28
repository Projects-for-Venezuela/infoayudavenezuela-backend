import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { PaginationNoticiaDto } from './dto/pagination-noticia.dto';

@Injectable()
export class NoticiasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateEstadoExists(id: string) {
    const estado = await this.databaseService.estados.findUnique({ where: { id } });
    if (!estado) throw new BadRequestException(`Estado con ID "${id}" no encontrado.`);
  }

  async validateCiudadExists(id: string) {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id } });
    if (!ciudad) throw new BadRequestException(`Ciudad con ID "${id}" no encontrada.`);
    return ciudad;
  }

  async create(createNoticiaDto: CreateNoticiaDto) {
    const { estado_id, ciudad_id } = createNoticiaDto;

    if (estado_id) await this.validateEstadoExists(estado_id);
    if (ciudad_id) await this.validateCiudadExists(ciudad_id);

    if (estado_id && ciudad_id) {
      const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudad_id } });
      if (ciudad?.estado_id !== estado_id) {
        throw new BadRequestException('La ciudad no pertenece al estado indicado.');
      }
    }

    try {
      return await this.databaseService.noticias.create({
        data: createNoticiaDto as Prisma.noticiasCreateInput,
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationNoticiaDto: PaginationNoticiaDto) {
    const page = paginationNoticiaDto.page ?? 1;
    const limit = paginationNoticiaDto.limit ?? 20;
    const { search, estado_id, estado } = paginationNoticiaDto;

    const where: Prisma.noticiasWhereInput = {
      ...(search && {
        OR: [
          { titulo: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(estado_id && { estado_id }),
      ...(estado && { estado }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.noticias.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.databaseService.noticias.count({ where }),
    ]);

    return PaginationHelper.build(items, total, page, limit);
  }

  async findOne(id: string) {
    const noticia = await this.databaseService.noticias.findUnique({
      where: { id },
      include: {
        estados: true,
        ciudades: true,
      },
    });

    if (!noticia) throw new NotFoundException(`Noticia con ID "${id}" no encontrada.`);

    return noticia;
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto) {
    if (Object.keys(updateNoticiaDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.noticias.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Noticia con ID "${id}" no encontrada.`);

    const estadoIdToUse = updateNoticiaDto.estado_id ?? existing.estado_id;

    if (updateNoticiaDto.estado_id) await this.validateEstadoExists(updateNoticiaDto.estado_id);
    if (updateNoticiaDto.ciudad_id) await this.validateCiudadExists(updateNoticiaDto.ciudad_id);

    if (estadoIdToUse && updateNoticiaDto.ciudad_id) {
      const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: updateNoticiaDto.ciudad_id } });
      if (ciudad?.estado_id !== estadoIdToUse) {
        throw new BadRequestException('La ciudad no pertenece al estado indicado.');
      }
    }

    try {
      return await this.databaseService.noticias.update({
        where: { id },
        data: updateNoticiaDto as Prisma.noticiasUpdateInput,
        include: { estados: true, ciudades: true },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.noticias.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Noticia con ID "${id}" no encontrada.`);

    try {
      return await this.databaseService.noticias.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(`Ya existe un registro duplicado en: ${fields}`);
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(`Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`);
        }
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el recurso (código: ${error.code}).`);
      }
    }

    throw error;
  }
}
