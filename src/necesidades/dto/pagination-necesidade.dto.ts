import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export const CIUDADES_NECESIDADES = ['Caracas', 'La Guaira', 'El Junquito', 'Tucacas'] as const;

export class PaginationNecesidadeDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por ciudad afectado',
    enum: CIUDADES_NECESIDADES,
    example: 'Caracas',
  })
  @IsOptional()
  @IsString()
  @IsIn(CIUDADES_NECESIDADES)
  city?: string;
}
