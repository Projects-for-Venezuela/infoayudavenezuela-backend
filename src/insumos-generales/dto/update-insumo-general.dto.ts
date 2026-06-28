import { PartialType } from '@nestjs/swagger';
import { CreateInsumoGeneralDto } from './create-insumo-general.dto';

export class UpdateInsumoGeneralDto extends PartialType(CreateInsumoGeneralDto) {}
