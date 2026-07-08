import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/enums';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationUserDto extends PaginationDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
