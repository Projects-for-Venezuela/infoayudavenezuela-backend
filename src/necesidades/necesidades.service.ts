import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { DatabaseService } from '~/database/database.service';
import { PaginationHelper } from '~/common/pagination/pagination';
import { ResponseHelper } from '~/common/response/response.helper';
import { CreateNecesidadeDto } from './dto/create-necesidade.dto';
import { UpdateNecesidadeDto } from './dto/update-necesidade.dto';
import { ESTADOS_NECESIDADES, PaginationNecesidadeDto } from './dto/pagination-necesidade.dto';

@Injectable()
export class NecesidadesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly include = {
    estados: { select: { id: true, nombre: true } },
    ciudades: { select: { id: true, nombre: true } },
  } satisfies Prisma.necesidades_urgentesInclude;

  async selectEstado() {
    return this.databaseService.estados.findMany({
      where: { nombre: { in: [...ESTADOS_NECESIDADES] } },
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async create(createNecesidadeDto: CreateNecesidadeDto) {
    const data: Prisma.necesidades_urgentesUncheckedCreateInput = {
      ...createNecesidadeDto,
    };

    try {
      return await this.databaseService.necesidades_urgentes.create({
        data,
        include: this.include,
      });
    } catch (error) {
      // Estado o ciudad inexistentes (violación de llave foránea).
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('El estado o la ciudad indicados no existen');
      }
      throw error;
    }
  }

  /** Listado paginado que muestra SOLO las necesidades verificadas. */
  async findAllVerified(paginationDto: PaginationNecesidadeDto) {
    return this.paginate(paginationDto, { verificado: true });
  }

  /** Listado paginado que muestra TODAS las necesidades. */
  async findAllPaginated(paginationDto: PaginationNecesidadeDto) {
    return this.paginate(paginationDto);
  }

  /** Obtiene una necesidad por su id (UUID). */
  async findOne(id: string) {
    const necesidad = await this.databaseService.necesidades_urgentes.findUnique({
      where: { id },
      include: this.include,
    });

    if (!necesidad) {
      throw new NotFoundException(`No se encontró la necesidad con id ${id}`);
    }

    return necesidad;
  }

  /** Actualiza una necesidad existente. */
  async update(id: string, updateNecesidadeDto: UpdateNecesidadeDto) {
    await this.findOne(id);

    return this.databaseService.necesidades_urgentes.update({
      where: { id },
      data: updateNecesidadeDto,
      include: this.include,
    });
  }

  /** Servicio independiente: marca una necesidad como verificada (verificado = true). */
  async verificar(id: string) {
    await this.findOne(id);

    return this.databaseService.necesidades_urgentes.update({
      where: { id },
      data: { verificado: true },
      include: this.include,
    });
  }

  /** Elimina una necesidad existente. */
  async remove(id: string) {
    await this.findOne(id);

    await this.databaseService.necesidades_urgentes.delete({ where: { id } });

    return new ResponseHelper(`Necesidad ${id} eliminada correctamente`, []);
  }

  private async paginate(
    paginationDto: PaginationNecesidadeDto,
    extraWhere: Prisma.necesidades_urgentesWhereInput = {},
  ) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 20;
    const { search, state } = paginationDto;

    const where: Prisma.necesidades_urgentesWhereInput = {
      ...extraWhere,
      ...(state && {
        estados: { nombre: { equals: state, mode: 'insensitive' } },
      }),
      ...(search && {
        lugar: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.databaseService.$transaction([
      this.databaseService.necesidades_urgentes.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: this.include,
      }),
      this.databaseService.necesidades_urgentes.count({ where }),
    ]);

    return PaginationHelper.build(data, total, page, limit);
  }
}
