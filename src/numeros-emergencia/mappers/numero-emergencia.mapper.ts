import { Prisma } from 'generated/prisma/client';
import { NumeroEmergenciaResponseDto } from '../dto/numero-emergencia-response.dto';

type NumeroEmergenciaEntity = Prisma.numeros_emergenciaGetPayload<{
  include: {
    estados?: true;
    ciudades?: true;
    tipos_numero_emergencia?: true;
  };
}>;

export class NumeroEmergenciaMapper {
  static toResponse(entity: NumeroEmergenciaEntity): NumeroEmergenciaResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      numero: entity.numero,
      estado: entity.estados?.nombre ?? null,
      ciudad: entity.ciudades?.nombre ?? null,
      tipo: entity.tipos_numero_emergencia?.nombre ?? null,
      orden: entity.orden,
      verificado: entity.verificado,
    };
  }

  static toResponseList(entities: NumeroEmergenciaEntity[]): NumeroEmergenciaResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
