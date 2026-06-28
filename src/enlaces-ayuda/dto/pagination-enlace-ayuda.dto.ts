import { PaginationDto } from '~/common/pagination/dto/pagination.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PaginationEnlaceAyudaDto extends PaginationDto {
  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  verificado?: boolean;
}
