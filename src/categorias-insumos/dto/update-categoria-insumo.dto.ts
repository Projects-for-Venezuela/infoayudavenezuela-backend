import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaInsumoDto } from './create-categoria-insumo.dto';

export class UpdateCategoriaInsumoDto extends PartialType(CreateCategoriaInsumoDto) {}
