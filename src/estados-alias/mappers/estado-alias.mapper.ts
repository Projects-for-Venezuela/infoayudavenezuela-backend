import { estados_alias } from 'generated/prisma/client';
import { EstadoAliasResponseDto } from '../dto/estado-alias-response.dto';

export class EstadoAliasMapper {
  static toResponse(entity: estados_alias): EstadoAliasResponseDto {
    return {
      id: entity.id,
      alias: entity.alias,
      estado_id: entity.estado_id,
    };
  }

  static toResponseList(entities: estados_alias[]): EstadoAliasResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}
