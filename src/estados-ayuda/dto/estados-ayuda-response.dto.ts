import { ApiProperty } from '@nestjs/swagger';

export class EstadosAyudaResponseDto {
  @ApiProperty()
  estado_id!: string;

  @ApiProperty()
  nivel_ayuda!: string;

  @ApiProperty()
  updated_at!: Date;
}
