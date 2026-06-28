import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TipoNumeroEmergenciaResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  orden?: number;
}
