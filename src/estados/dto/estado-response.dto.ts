import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstadoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional({ type: Number })
  _count?: {
    ciudades: number;
    refugios: number;
    centros_acopio: number;
    pacientes: number;
  };
}
