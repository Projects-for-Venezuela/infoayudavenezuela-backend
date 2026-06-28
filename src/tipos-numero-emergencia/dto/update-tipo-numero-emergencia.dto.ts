import { PartialType } from '@nestjs/swagger';
import { CreateTipoNumeroEmergenciaDto } from './create-tipo-numero-emergencia.dto';

export class UpdateTipoNumeroEmergenciaDto extends PartialType(CreateTipoNumeroEmergenciaDto) {}
