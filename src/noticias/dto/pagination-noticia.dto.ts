import { PaginationDto } from '~/common/pagination/dto/pagination.dto';
import { IsOptional, IsString, IsUUID, IsIn } from 'class-validator';

export class PaginationNoticiaDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4', { message: 'El campo estado_id debe ser un UUID válido.' })
  estado_id?: string;

  @IsOptional()
  @IsIn(['pendiente', 'publicada', 'archivada'], { message: 'Estado inválido.' })
  estado?: string;
}
