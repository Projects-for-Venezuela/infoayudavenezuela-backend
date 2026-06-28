import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationRefugiadoDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Filtrar por ID del refugio (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El refugio_id debe ser un UUID válido' })
  refugio_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de verificación',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'El campo verificado debe ser un valor booleano' })
  verificado?: boolean;
}
