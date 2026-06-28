import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationEstadosAyudaDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Filtrar por ID de estado' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del estado debe ser un UUID válido' })
  estado_id?: string;
}
