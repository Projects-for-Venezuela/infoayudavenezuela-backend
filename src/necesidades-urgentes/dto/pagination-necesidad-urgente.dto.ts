import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationNecesidadUrgenteDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Filtrar por ID del estado (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  estado_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de la ciudad (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  ciudad_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado de verificación', example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'El campo verificado debe ser un valor booleano' })
  verificado?: boolean;
}
