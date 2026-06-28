import { Prisma } from 'generated/prisma/client';
import { EstadoResponseDto } from '../dto/estado-response.dto';

type EstadoEntity = Prisma.estadosGetPayload<{
  include: {
    ciudades?: { select: { id: true; nombre: true } } | true;
    refugios?: { select: { id: true; nombre: true } } | true;
    _count?: {
      select: {
        ciudades: boolean;
        refugios: boolean;
        centros_acopio: boolean;
        pacientes: boolean;
      };
    };
  };
}>;

export class EstadoMapper {
  static toResponse(estado: EstadoEntity): EstadoResponseDto {
    return {
      id: estado.id,
      nombre: estado.nombre,
      _count: estado._count as EstadoResponseDto['_count'],
    };
  }

  static toResponseList(estados: EstadoEntity[]): EstadoResponseDto[] {
    return estados.map((estado) => this.toResponse(estado));
  }
}
