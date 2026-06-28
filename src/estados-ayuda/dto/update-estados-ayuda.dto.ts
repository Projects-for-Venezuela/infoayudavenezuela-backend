import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEstadosAyudaDto } from './create-estados-ayuda.dto';

export class UpdateEstadosAyudaDto extends PartialType(
  OmitType(CreateEstadosAyudaDto, ['estado_id'] as const),
) {}
