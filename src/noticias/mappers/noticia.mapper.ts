import { Prisma } from 'generated/prisma/client';
import { NoticiaResponseDto } from '../dto/noticia-response.dto';

type NoticiaEntity = Prisma.noticiasGetPayload<{
  include: {
    estados?: true;
    ciudades?: true;
  };
}>;

export class NoticiaMapper {
  static toResponse(noticia: NoticiaEntity): NoticiaResponseDto {
    return {
      id: noticia.id,
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      fuente: noticia.fuente,
      estado_nombre: noticia.estados?.nombre ?? null,
      ciudad_nombre: noticia.ciudades?.nombre ?? null,
      estado: noticia.estado,
      created_at: noticia.created_at,
    };
  }

  static toResponseList(noticias: NoticiaEntity[]): NoticiaResponseDto[] {
    return noticias.map((noticia) => this.toResponse(noticia));
  }
}
