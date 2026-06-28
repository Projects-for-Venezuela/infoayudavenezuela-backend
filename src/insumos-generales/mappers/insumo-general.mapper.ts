import { insumos_generales } from 'generated/prisma/client';
import { InsumoGeneralResponseDto } from '../dto/insumo-general-response.dto';

export class InsumoGeneralMapper {
  static toResponse(insumo: insumos_generales): InsumoGeneralResponseDto {
    return {
      id: insumo.id,
      nombre: insumo.nombre,
      orden: insumo.orden,
    };
  }

  static toResponseList(insumos: insumos_generales[]): InsumoGeneralResponseDto[] {
    return insumos.map((ins) => this.toResponse(ins));
  }
}
