import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreateEnlaceAyudaDto } from './dto/create-enlace-ayuda.dto';
import { UpdateEnlaceAyudaDto } from './dto/update-enlace-ayuda.dto';
import { PaginationEnlaceAyudaDto } from './dto/pagination-enlace-ayuda.dto';

@Injectable()
export class EnlacesAyudaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateAdminExists(id: string) {
    const admin = await this.databaseService.admin_users.findUnique({ where: { id } });
    if (!admin) throw new BadRequestException(`El administrador con ID "${id}" no existe.`);
  }

  validateVerificadoConsistency(verificado?: boolean, verificadoPor?: string | null) {
    if (verificado === true && !verificadoPor) {
      throw new BadRequestException('Si el enlace está marcado como verificado, debe indicar quién lo verificó (verificado_por).');
    }

    if (verificado === false && verificadoPor) {
      throw new BadRequestException('No se puede asignar un verificador si el enlace no está marcado como verificado.');
    }
  }

  async ensureUrlUnique(url: string, excludeId?: string) {
    const existing = await this.databaseService.enlaces_ayuda.findFirst({ where: { url } });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Ya existe otro enlace con la misma URL.');
    }
  }

  async create(createDto: CreateEnlaceAyudaDto) {
    const { verificado_por, verificado, url } = createDto;

    if (verificado_por) await this.validateAdminExists(verificado_por);
    this.validateVerificadoConsistency(verificado, verificado_por);
    await this.ensureUrlUnique(url);

    try {
      return await this.databaseService.enlaces_ayuda.create({
        data: createDto as Prisma.enlaces_ayudaCreateInput,
      });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationDto: PaginationEnlaceAyudaDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, categoria, verificado } = paginationDto;

    const where: Prisma.enlaces_ayudaWhereInput = {
      ...(categoria && { categoria }),
      ...(verificado !== undefined && { verificado }),
      ...(search && {
        OR: [
          { titulo: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
          { url: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.enlaces_ayuda.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.databaseService.enlaces_ayuda.count({ where }),
    ]);

    return PaginationHelper.build(items, total, page, limit);
  }

  async findOne(id: string) {
    const enlace = await this.databaseService.enlaces_ayuda.findUnique({
      where: { id },
      include: {
        admin_users: {
          select: { id: true, email: true, rol: true },
        },
      },
    });

    if (!enlace) throw new NotFoundException(`Enlace con ID "${id}" no encontrado.`);

    return enlace;
  }

  async update(id: string, updateDto: UpdateEnlaceAyudaDto) {
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.enlaces_ayuda.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Enlace con ID "${id}" no encontrado.`);

    // Resolve coherence
    const finalVerificado = updateDto.verificado ?? existing.verificado;
    const finalVerificadoPor = updateDto.verificado_por !== undefined ? updateDto.verificado_por : existing.verificado_por;

    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    if (updateDto.verificado_por) await this.validateAdminExists(updateDto.verificado_por);
    if (updateDto.url) await this.ensureUrlUnique(updateDto.url, id);

    try {
      return await this.databaseService.enlaces_ayuda.update({
        where: { id },
        data: updateDto as Prisma.enlaces_ayudaUpdateInput,
        include: {
          admin_users: {
            select: { id: true, email: true, rol: true },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.enlaces_ayuda.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Enlace con ID "${id}" no encontrado.`);

    try {
      return await this.databaseService.enlaces_ayuda.delete({ where: { id } });
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
