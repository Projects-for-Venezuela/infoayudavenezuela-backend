import { ApiProperty } from '@nestjs/swagger';

export class EstadoAliasResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  alias!: string;

  @ApiProperty()
  estado_id!: string;
}
