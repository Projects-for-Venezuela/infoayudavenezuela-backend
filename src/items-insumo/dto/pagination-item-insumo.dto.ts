import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationItemInsumoDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Filtrar por ID de la categoría (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'El categoria_id debe ser un UUID válido' })
  categoria_id?: string;
}
