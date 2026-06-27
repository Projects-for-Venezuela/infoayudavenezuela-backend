import { PartialType } from '@nestjs/swagger';
import { CreateCentrosAcopioDto } from './create-centros-acopio.dto';

export class UpdateCentrosAcopioDto extends PartialType(CreateCentrosAcopioDto) {}
