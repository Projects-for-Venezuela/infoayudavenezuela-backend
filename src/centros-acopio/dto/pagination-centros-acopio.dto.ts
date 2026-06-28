import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationCentrosAcopioDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    example: 'Distrito Capital',
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  @Length(2, 100, { message: 'El estado debe tener entre 2 y 100 caracteres' })
  state?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ciudad',
    example: 'Maracay',
  })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  @Length(2, 100, { message: 'La ciudad debe tener entre 2 y 100 caracteres' })
  ciudad?: string;
}
