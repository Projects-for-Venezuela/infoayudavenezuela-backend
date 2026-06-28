import { ApiProperty } from '@nestjs/swagger';

export class EnlaceAyudaResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  titulo!: string;

  @ApiProperty()
  descripcion!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  categoria!: string;

  @ApiProperty()
  verificado!: boolean;
}
