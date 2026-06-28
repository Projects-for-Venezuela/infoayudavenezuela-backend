import { PartialType } from '@nestjs/swagger';
import { CreateEnlaceAyudaDto } from './create-enlace-ayuda.dto';

export class UpdateEnlaceAyudaDto extends PartialType(CreateEnlaceAyudaDto) {}
