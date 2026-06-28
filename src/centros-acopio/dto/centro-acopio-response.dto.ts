import { ApiProperty } from '@nestjs/swagger';

export class CentroAcopioResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ nullable: true })
  direccion!: string | null;

  @ApiProperty({ nullable: true })
  contacto!: string | null;

  @ApiProperty({ nullable: true })
  hora!: string | null;

  @ApiProperty({ type: [String] })
  acepta!: string[];

  @ApiProperty({ type: [String] })
  necesitan!: string[];

  @ApiProperty()
  verificado!: boolean;

  @ApiProperty()
  ciudad!: string;

  @ApiProperty()
  estado!: string;
}
