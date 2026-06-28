import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';
import { toBoolean } from '~/common/utils/boolean-transform';

export class PaginationEstadoDto extends PartialType(PaginationDto) {
  @IsOptional()
  @toBoolean()
  @IsBoolean({ message: 'El campo include_ciudad debe ser un valor booleano' })
  include_ciudad?: boolean;

  @IsOptional()
  @toBoolean()
  @IsBoolean({ message: 'El campo include_refugios debe ser un valor booleano' })
  include_refugios?: boolean;
}
