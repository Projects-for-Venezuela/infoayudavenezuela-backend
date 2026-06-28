import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemInsumoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  descripcion?: string | null;

  @ApiProperty()
  categoria!: string;

  @ApiPropertyOptional()
  orden?: number;
}
