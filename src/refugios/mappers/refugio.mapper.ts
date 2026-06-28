import { Prisma } from 'generated/prisma/client';
import { RefugioResponseDto } from '../dto/refugio-response.dto';

type RefugioEntity = Prisma.refugiosGetPayload<{
  include: {
    ciudades: true;
    estados: true;
  };
}>;

export class RefugioMapper {
  static toResponse(refugio: RefugioEntity): RefugioResponseDto {
    return {
      id: refugio.id,
      nombre: refugio.nombre,
      ciudad: refugio.ciudades.nombre,
      estado: refugio.estados.nombre,
      direccion: refugio.direccion,
      contacto: refugio.contacto,
      capacidad: refugio.capacidad,
      acepta: refugio.acepta,
      necesitan: refugio.necesitan,
      tipo: refugio.tipo,
      verificado: refugio.verificado,
    };
  }

  static toResponseList(refugios: RefugioEntity[]): RefugioResponseDto[] {
    return refugios.map((refugio) => this.toResponse(refugio));
  }
}
