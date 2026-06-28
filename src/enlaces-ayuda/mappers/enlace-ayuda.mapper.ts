import { Prisma } from 'generated/prisma/client';
import { EnlaceAyudaResponseDto } from '../dto/enlace-ayuda-response.dto';

type EnlaceAyudaEntity = Prisma.enlaces_ayudaGetPayload<{
  include?: {
    admin_users?: {
      select: { id: true; email: true; rol: true };
    };
  };
}>;

export class EnlaceAyudaMapper {
  static toResponse(enlace: EnlaceAyudaEntity): EnlaceAyudaResponseDto {
    return {
      id: enlace.id,
      titulo: enlace.titulo,
      descripcion: enlace.descripcion,
      url: enlace.url,
      categoria: enlace.categoria,
      verificado: enlace.verificado,
    };
  }

  static toResponseList(enlaces: EnlaceAyudaEntity[]): EnlaceAyudaResponseDto[] {
    return enlaces.map((enlace) => this.toResponse(enlace));
  }
}
