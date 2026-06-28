import { Prisma } from 'generated/prisma/client';
import { PacienteResponseDto } from '../dto/paciente-response.dto';

type PacienteEntity = Prisma.pacientesGetPayload<{
  include: {
    ciudades: true;
    estados: true;
    hospitales?: true;
  };
}>;

export class PacienteMapper {
  static toResponse(paciente: PacienteEntity): PacienteResponseDto {
    return {
      id: paciente.id,
      nombre_paciente: paciente.nombre_paciente,
      cedula: paciente.cedula,
      contacto: paciente.contacto,
      estado: paciente.estados.nombre,
      ciudad: paciente.ciudades.nombre,
      hospital: paciente.hospitales?.nombre ?? paciente.hospital_nombre_libre ?? null,
      necesitan: paciente.necesitan,
      estatus: paciente.estatus,
      verificado: paciente.verificado,
      created_at: paciente.created_at,
    };
  }

  static toResponseList(pacientes: PacienteEntity[]): PacienteResponseDto[] {
    return pacientes.map((paciente) => this.toResponse(paciente));
  }
}
