import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoriaInsumoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  orden?: number;
}
