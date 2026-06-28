import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateCiudadDto {
  @ApiProperty({ description: 'Nombre de la ciudad', example: 'Caracas' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la ciudad es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  nombre!: string;

  @ApiProperty({ description: 'ID del estado al que pertenece (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estado_id es obligatorio' })
  estado_id!: string;
}
