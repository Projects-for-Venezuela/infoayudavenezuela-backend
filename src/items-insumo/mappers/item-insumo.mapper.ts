import { Prisma } from 'generated/prisma/client';
import { ItemInsumoResponseDto } from '../dto/item-insumo-response.dto';

type ItemInsumoEntity = Prisma.items_insumoGetPayload<{
  include: {
    categorias_insumos: true;
  };
}>;

export class ItemInsumoMapper {
  static toResponse(item: ItemInsumoEntity): ItemInsumoResponseDto {
    return {
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria: item.categorias_insumos.nombre,
      orden: item.orden,
    };
  }

  static toResponseList(items: ItemInsumoEntity[]): ItemInsumoResponseDto[] {
    return items.map((item) => this.toResponse(item));
  }
}
