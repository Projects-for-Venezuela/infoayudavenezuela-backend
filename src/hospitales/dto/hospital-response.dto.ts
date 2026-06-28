import { ApiProperty } from '@nestjs/swagger';

export class HospitalResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  ciudad!: string;
}
