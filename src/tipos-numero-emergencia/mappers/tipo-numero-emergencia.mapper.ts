import { tipos_numero_emergencia } from 'generated/prisma/client';
import { TipoNumeroEmergenciaResponseDto } from '../dto/tipo-numero-emergencia-response.dto';

export class TipoNumeroEmergenciaMapper {
  static toResponse(tipo: tipos_numero_emergencia): TipoNumeroEmergenciaResponseDto {
    return {
      id: tipo.id,
      nombre: tipo.nombre,
      slug: tipo.slug,
      orden: tipo.orden,
    };
  }

  static toResponseList(tipos: tipos_numero_emergencia[]): TipoNumeroEmergenciaResponseDto[] {
    return tipos.map((t) => this.toResponse(t));
  }
}
