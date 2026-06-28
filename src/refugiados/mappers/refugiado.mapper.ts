import { Prisma } from 'generated/prisma/client';
import { RefugiadoResponseDto } from '../dto/refugiado-response.dto';

type RefugiadoEntity = Prisma.refugiadosGetPayload<{
  include: {
    refugios?: {
      select: { id: true; nombre: true };
    };
  };
}>;

export class RefugiadoMapper {
  static toResponse(refugiado: RefugiadoEntity): RefugiadoResponseDto {
    return {
      id: refugiado.id,
      nombre_completo: refugiado.nombre_completo,
      cedula: refugiado.cedula,
      telefono: refugiado.telefono,
      refugio: refugiado.refugios?.nombre ?? null,
      estado_salud: refugiado.estado_salud,
      necesidades_especificas: refugiado.necesidades_especificas,
      verificado: refugiado.verificado,
    };
  }

  static toResponseList(refugiados: RefugiadoEntity[]): RefugiadoResponseDto[] {
    return refugiados.map((refugiado) => this.toResponse(refugiado));
  }
}
