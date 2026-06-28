import { estados_ayuda } from 'generated/prisma/client';
import { EstadosAyudaResponseDto } from '../dto/estados-ayuda-response.dto';

export class EstadosAyudaMapper {
  static toResponse(entity: estados_ayuda): EstadosAyudaResponseDto {
    return {
      estado_id: entity.estado_id,
      nivel_ayuda: entity.nivel_ayuda,
      updated_at: entity.updated_at,
    };
  }

  static toResponseList(entities: estados_ayuda[]): EstadosAyudaResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}
