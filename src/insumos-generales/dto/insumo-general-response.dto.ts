import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InsumoGeneralResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  orden?: number;
}
