import { PartialType } from '@nestjs/swagger';
import { CreateNumeroEmergenciaDto } from './create-numero-emergencia.dto';

export class UpdateNumeroEmergenciaDto extends PartialType(CreateNumeroEmergenciaDto) {}
