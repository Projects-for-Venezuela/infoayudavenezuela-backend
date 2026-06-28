import { PartialType } from '@nestjs/swagger';
import { CreateCentroAcopioDto } from '~/centros-acopio/dto/create-centros-acopio.dto';

export class UpdateCentrosAcopioDto extends PartialType(CreateCentroAcopioDto) {}
