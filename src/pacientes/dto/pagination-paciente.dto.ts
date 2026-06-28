import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationPacienteDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Filtrar por ID del estado (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  estado_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de la ciudad (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  ciudad_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estatus', example: 'DESCONOCIDO' })
  @IsOptional()
  @IsString()
  estatus?: string;
}
