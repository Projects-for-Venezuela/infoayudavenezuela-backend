import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefugioResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  ciudad!: string;

  @ApiProperty()
  estado!: string;

  @ApiPropertyOptional()
  direccion?: string | null;

  @ApiPropertyOptional()
  contacto?: string | null;

  @ApiPropertyOptional()
  capacidad?: string | null;

  @ApiProperty({ type: [String] })
  acepta!: string[];

  @ApiProperty({ type: [String] })
  necesitan!: string[];

  @ApiProperty()
  tipo!: string;

  @ApiProperty()
  verificado!: boolean;
}
