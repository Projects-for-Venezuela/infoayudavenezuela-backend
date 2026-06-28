import { categorias_insumos } from 'generated/prisma/client';
import { CategoriaInsumoResponseDto } from '../dto/categoria-insumo-response.dto';

export class CategoriaInsumoMapper {
  static toResponse(categoria: categorias_insumos): CategoriaInsumoResponseDto {
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      orden: (categoria as unknown as { orden?: number }).orden,
    };
  }

  static toResponseList(categorias: categorias_insumos[]): CategoriaInsumoResponseDto[] {
    return categorias.map((cat) => this.toResponse(cat));
  }
}
