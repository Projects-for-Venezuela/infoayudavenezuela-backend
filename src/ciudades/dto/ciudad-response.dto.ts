import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CiudadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  estado!: string;

  @ApiPropertyOptional({ type: Number })
  _count?: {
    refugios: number;
    centros_acopio: number;
    hospitales: number;
    pacientes: number;
  };
}
