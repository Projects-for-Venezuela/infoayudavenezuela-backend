import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NecesidadUrgenteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  lugar!: string;

  @ApiPropertyOptional()
  direccion?: string | null;

  @ApiProperty()
  que_necesitan!: string;

  @ApiPropertyOptional()
  contacto?: string | null;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  ciudad!: string;

  @ApiProperty()
  verificado!: boolean;

  @ApiProperty()
  created_at!: Date;
}
