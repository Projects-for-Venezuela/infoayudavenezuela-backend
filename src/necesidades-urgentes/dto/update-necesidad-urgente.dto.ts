import { PartialType } from '@nestjs/swagger';
import { CreateNecesidadUrgenteDto } from './create-necesidad-urgente.dto';

export class UpdateNecesidadUrgenteDto extends PartialType(CreateNecesidadUrgenteDto) {}
