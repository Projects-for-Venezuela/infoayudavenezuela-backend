import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NumeroEmergenciaResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  numero?: string | null;

  @ApiPropertyOptional()
  estado?: string | null;

  @ApiPropertyOptional()
  ciudad?: string | null;

  @ApiPropertyOptional()
  tipo?: string | null;

  @ApiProperty()
  orden!: number;

  @ApiProperty()
  verificado!: boolean;
}
