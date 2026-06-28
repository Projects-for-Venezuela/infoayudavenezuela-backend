import { PartialType } from '@nestjs/swagger';
import { CreateRefugioDto } from './create-refugio.dto';

export class UpdateRefugioDto extends PartialType(CreateRefugioDto) {}
