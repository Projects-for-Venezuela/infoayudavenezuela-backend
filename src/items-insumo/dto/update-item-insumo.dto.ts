import { PartialType } from '@nestjs/swagger';
import { CreateItemInsumoDto } from './create-item-insumo.dto';

export class UpdateItemInsumoDto extends PartialType(CreateItemInsumoDto) {}
