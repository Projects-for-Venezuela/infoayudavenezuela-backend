import { PartialType } from '@nestjs/swagger';
import { CreateRefugiadoDto } from './create-refugiado.dto';

export class UpdateRefugiadoDto extends PartialType(CreateRefugiadoDto) {}
