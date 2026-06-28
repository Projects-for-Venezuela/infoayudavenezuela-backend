import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoticiaResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  titulo!: string;

  @ApiProperty()
  descripcion!: string;

  @ApiPropertyOptional()
  fuente?: string | null;

  @ApiPropertyOptional()
  estado_nombre?: string | null;

  @ApiPropertyOptional()
  ciudad_nombre?: string | null;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  created_at!: Date;
}
