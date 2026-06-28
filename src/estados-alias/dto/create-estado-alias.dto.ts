import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateEstadoAliasDto {
  @ApiProperty({ description: 'Alias del estado', example: 'Miranda' })
  @IsString({ message: 'El alias debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El alias es obligatorio' })
  @MinLength(2, { message: 'El alias debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El alias no puede exceder 100 caracteres' })
  alias!: string;

  @ApiProperty({ description: 'ID del estado asociado', example: 'uuid-del-estado' })
  @IsString({ message: 'El ID del estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del estado es obligatorio' })
  @IsUUID('4', { message: 'El ID del estado debe ser un UUID válido' })
  estado_id!: string;
}
