import { Prisma } from 'generated/prisma/client';
import { CentroAcopioResponseDto } from '../dto/centro-acopio-response.dto';

type CentroAcopioEntity = Prisma.centros_acopioGetPayload<{
  include: {
    ciudades: true;
    estados: true;
  };
}>;

export class CentroAcopioMapper {
  static toResponse(centro: CentroAcopioEntity): CentroAcopioResponseDto {
    return {
      id: centro.id,
      nombre: centro.nombre,
      direccion: centro.direccion,
      contacto: centro.contacto,
      hora: centro.hora,
      acepta: centro.acepta,
      necesitan: centro.necesitan,
      verificado: centro.verificado,
      ciudad: centro.ciudades.nombre,
      estado: centro.estados.nombre,
    };
  }

  static toResponseList(centros: CentroAcopioEntity[]): CentroAcopioResponseDto[] {
    return centros.map((centro) => this.toResponse(centro));
  }
}
