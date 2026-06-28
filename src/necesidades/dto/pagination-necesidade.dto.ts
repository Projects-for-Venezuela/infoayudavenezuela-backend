import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export const ESTADOS_NECESIDADES = ['Distrito Capital', 'La Guaira', 'Miranda', 'Falcón'] as const;

export class PaginationNecesidadeDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por estado afectado',
    enum: ESTADOS_NECESIDADES,
    example: 'Distrito Capital',
  })
  @IsOptional()
  @IsString()
  @IsIn(ESTADOS_NECESIDADES)
  state?: string;
}
