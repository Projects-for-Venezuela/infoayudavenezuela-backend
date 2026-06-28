import { Prisma } from 'generated/prisma/client';
import { NecesidadUrgenteResponseDto } from '../dto/necesidad-urgente-response.dto';

type NecesidadUrgenteEntity = Prisma.necesidades_urgentesGetPayload<{
  include: {
    ciudades: true;
    estados: true;
  };
}>;

export class NecesidadUrgenteMapper {
  static toResponse(entity: NecesidadUrgenteEntity): NecesidadUrgenteResponseDto {
    return {
      id: entity.id,
      lugar: entity.lugar,
      direccion: entity.direccion,
      que_necesitan: entity.que_necesitan,
      contacto: entity.contacto,
      estado: entity.estados.nombre,
      ciudad: entity.ciudades.nombre,
      verificado: entity.verificado,
      created_at: entity.created_at,
    };
  }

  static toResponseList(entities: NecesidadUrgenteEntity[]): NecesidadUrgenteResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
