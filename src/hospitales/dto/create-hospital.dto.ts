import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateHospitalDto {
  @ApiProperty({ description: 'Nombre del hospital', example: 'Hospital General del Este' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del hospital es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre!: string;

  @ApiProperty({ description: 'ID de la ciudad (UUID)', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ciudad_id es obligatorio' })
  ciudad_id!: string;
}
