import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefugiadoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre_completo!: string;

  @ApiPropertyOptional()
  cedula?: string | null;

  @ApiPropertyOptional()
  telefono?: string | null;

  @ApiPropertyOptional()
  refugio?: string | null;

  @ApiPropertyOptional()
  estado_salud?: string | null;

  @ApiPropertyOptional()
  necesidades_especificas?: string | null;

  @ApiProperty()
  verificado!: boolean;
}
