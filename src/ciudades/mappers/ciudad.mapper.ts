import { Prisma } from 'generated/prisma/client';
import { CiudadResponseDto } from '../dto/ciudad-response.dto';

type CiudadEntity = Prisma.ciudadesGetPayload<{
  include: {
    estados: true;
    _count?: {
      select: {
        refugios: boolean;
        centros_acopio: boolean;
        hospitales: boolean;
        pacientes: boolean;
      };
    };
  };
}>;

export class CiudadMapper {
  static toResponse(ciudad: CiudadEntity): CiudadResponseDto {
    return {
      id: ciudad.id,
      nombre: ciudad.nombre,
      estado: ciudad.estados.nombre,
      _count: ciudad._count as CiudadResponseDto['_count'],
    };
  }

  static toResponseList(ciudades: CiudadEntity[]): CiudadResponseDto[] {
    return ciudades.map((ciudad) => this.toResponse(ciudad));
  }
}
