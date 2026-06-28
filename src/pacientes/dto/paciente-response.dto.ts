import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PacienteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre_paciente!: string;

  @ApiPropertyOptional()
  cedula?: string | null;

  @ApiPropertyOptional()
  contacto?: string | null;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  ciudad!: string;

  @ApiPropertyOptional()
  hospital?: string | null;

  @ApiProperty({ type: [String] })
  necesitan!: string[];

  @ApiProperty()
  estatus!: string;

  @ApiProperty()
  verificado!: boolean;

  @ApiProperty()
  created_at!: Date;
}
