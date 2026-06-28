import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { Prisma } from 'generated/prisma/client';
import { PaginationHelper } from '~/common/pagination/pagination';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PaginationPacienteDto } from './dto/pagination-paciente.dto';
import { PacienteMapper } from './mappers/paciente.mapper';

@Injectable()
export class PacientesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateEstadoExists(estadoId: string): Promise<void> {
    const estado = await this.databaseService.estados.findUnique({ where: { id: estadoId } });
    if (!estado) throw new BadRequestException(`El estado con ID "${estadoId}" no existe.`);
  }

  async validateCiudadExists(ciudadId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudadId } });
    if (!ciudad) throw new BadRequestException(`La ciudad con ID "${ciudadId}" no existe.`);
  }

  async validateCiudadEnEstado(ciudadId: string, estadoId: string): Promise<void> {
    const ciudad = await this.databaseService.ciudades.findUnique({ where: { id: ciudadId } });
    if (!ciudad) throw new BadRequestException(`La ciudad con ID "${ciudadId}" no existe.`);
    if (ciudad.estado_id !== estadoId) {
      throw new BadRequestException('La ciudad no pertenece al estado seleccionado.');
    }
  }

  async validateHospitalExists(hospitalId: string): Promise<void> {
    const hospital = await this.databaseService.hospitales.findUnique({ where: { id: hospitalId } });
    if (!hospital) throw new BadRequestException(`El hospital con ID "${hospitalId}" no existe.`);
  }

  async validateAdminExists(adminId: string): Promise<void> {
    const admin = await this.databaseService.admin_users.findUnique({ where: { id: adminId } });
    if (!admin) throw new BadRequestException(`El administrador con ID "${adminId}" no existe.`);
  }

  validateVerificadoConsistency(verificado?: boolean, verificadoPor?: string | null): void {
    if (verificado === true && !verificadoPor) {
      throw new BadRequestException('Si el paciente está marcado como verificado, debe indicar quién lo verificó (verificado_por).');
    }
    if (verificado === false && verificadoPor) {
      throw new BadRequestException('No se puede asignar un verificador si el paciente no está marcado como verificado.');
    }
  }

  async create(createPacienteDto: CreatePacienteDto) {
    const { estado_id, ciudad_id, hospital_id, verificado, verificado_por } = createPacienteDto;

    await this.validateEstadoExists(estado_id);
    await this.validateCiudadEnEstado(ciudad_id, estado_id);

    if (hospital_id) await this.validateHospitalExists(hospital_id);
    if (verificado_por) await this.validateAdminExists(verificado_por);
    this.validateVerificadoConsistency(verificado, verificado_por);

    try {
      const paciente = await this.databaseService.pacientes.create({
        data: createPacienteDto as unknown as Prisma.pacientesCreateInput,
        include: { ciudades: true, estados: true, hospitales: true },
      });

      return PacienteMapper.toResponse(paciente);
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async pagination(paginationPacienteDto: PaginationPacienteDto) {
    const page = paginationPacienteDto.page ?? 1;
    const limit = paginationPacienteDto.limit ?? 20;
    const { search, estado_id, ciudad_id, estatus } = paginationPacienteDto;

    const where: Prisma.pacientesWhereInput = {
      ...(estado_id && { estado_id }),
      ...(ciudad_id && { ciudad_id }),
      ...(estatus && { estatus }),
      ...(search && {
        OR: [
          { nombre_paciente: { contains: search, mode: 'insensitive' } },
          { cedula: { contains: search, mode: 'insensitive' } },
          { contacto: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [pacientes, total] = await this.databaseService.$transaction([
      this.databaseService.pacientes.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { ciudades: true, estados: true, hospitales: true },
      }),
      this.databaseService.pacientes.count({ where }),
    ]);

    const data = PacienteMapper.toResponseList(pacientes);
    return PaginationHelper.build(data, total, page, limit);
  }

  async findOne(id: string) {
    const paciente = await this.databaseService.pacientes.findUnique({
      where: { id },
      include: { ciudades: true, estados: true, hospitales: true },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);
    }

    return PacienteMapper.toResponse(paciente);
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    if (Object.keys(updatePacienteDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const existing = await this.databaseService.pacientes.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);

    const { estado_id, ciudad_id, hospital_id, verificado, verificado_por } = updatePacienteDto;

    const finalEstadoId = estado_id ?? existing.estado_id;
    const finalCiudadId = ciudad_id ?? existing.ciudad_id;

    if (estado_id) await this.validateEstadoExists(estado_id);
    if (ciudad_id || estado_id) await this.validateCiudadEnEstado(finalCiudadId, finalEstadoId);
    if (hospital_id) await this.validateHospitalExists(hospital_id);
    if (verificado_por) await this.validateAdminExists(verificado_por);

    const finalVerificado = verificado ?? existing.verificado;
    const finalVerificadoPor = verificado_por !== undefined ? verificado_por : existing.verificado_por;
    this.validateVerificadoConsistency(finalVerificado, finalVerificadoPor);

    try {
      const paciente = await this.databaseService.pacientes.update({
        where: { id },
        data: updatePacienteDto as Prisma.pacientesUpdateInput,
        include: { ciudades: true, estados: true, hospitales: true },
      });

      return PacienteMapper.toResponse(paciente);
    } catch (error) {
      this.handlePrismaError(error, 'actualizar');
    }
  }

  async remove(id: string) {
    const existing = await this.databaseService.pacientes.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Paciente con ID "${id}" no encontrado.`);

    try {
      await this.databaseService.pacientes.delete({ where: { id } });
      return { message: 'Paciente eliminado correctamente.' };
    } catch (error) {
      this.handlePrismaError(error, 'eliminar');
    }
  }

  handlePrismaError(error: unknown, operacion: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const fields = (error.meta?.target as string[])?.join(', ') ?? 'desconocido';
          throw new BadRequestException(`Ya existe un paciente duplicado en: ${fields}.`);
        }
        case 'P2003': {
          const field = (error.meta?.field_name as string) ?? 'desconocido';
          throw new BadRequestException(`Error de referencia: el campo "${field}" hace referencia a un registro que no existe.`);
        }
        case 'P2025':
          throw new NotFoundException(`No se encontró el registro que se intentó ${operacion}.`);
        default:
          throw new BadRequestException(`Error de base de datos al ${operacion} el paciente (código: ${error.code}).`);
      }
    }
    throw error;
  }
}
