import { PartialType } from '@nestjs/swagger';
import { CreateNecesidadeDto } from './create-necesidade.dto';

export class UpdateNecesidadeDto extends PartialType(CreateNecesidadeDto) {}
