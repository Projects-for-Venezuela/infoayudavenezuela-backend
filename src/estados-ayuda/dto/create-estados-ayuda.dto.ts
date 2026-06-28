import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateEstadosAyudaDto {
  @ApiProperty({ description: 'ID del estado (UUID)', example: 'uuid-del-estado' })
  @IsString({ message: 'El ID del estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del estado es obligatorio' })
  @IsUUID('4', { message: 'El ID del estado debe ser un UUID válido' })
  estado_id!: string;

  @ApiProperty({ description: 'Nivel de ayuda del estado', example: 'Alto' })
  @IsString({ message: 'El nivel de ayuda debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nivel de ayuda es obligatorio' })
  @MinLength(2, { message: 'El nivel de ayuda debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nivel de ayuda no puede exceder 100 caracteres' })
  nivel_ayuda!: string;
}
