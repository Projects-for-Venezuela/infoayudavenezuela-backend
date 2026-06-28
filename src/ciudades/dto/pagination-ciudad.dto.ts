import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationCiudadDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por ID del estado (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  estado_id?: string;
}
