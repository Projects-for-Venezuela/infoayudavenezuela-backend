import { PartialType } from '@nestjs/swagger';
import { CreateEstadoAliasDto } from './create-estado-alias.dto';

export class UpdateEstadoAliasDto extends PartialType(CreateEstadoAliasDto) {}
