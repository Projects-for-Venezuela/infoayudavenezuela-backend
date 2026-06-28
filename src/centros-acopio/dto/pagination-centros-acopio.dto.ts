import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationCentrosAcopioDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    example: 'Distrito Capital',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  state?: string;
}
