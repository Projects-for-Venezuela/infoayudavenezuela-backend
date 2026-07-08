import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: Role })
  role!: Role;
}
