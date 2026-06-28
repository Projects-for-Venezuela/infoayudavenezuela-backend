import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateNecesidadUrgenteDto {
  @ApiProperty({ description: 'ID del estado (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estado_id es obligatorio' })
  estado_id!: string;

  @ApiProperty({ description: 'ID de la ciudad (UUID)', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ciudad_id es obligatorio' })
  ciudad_id!: string;

  @ApiProperty({ description: 'Nombre del lugar', example: 'Hospital Universitario de Maracaibo' })
  @IsString({ message: 'El lugar debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El lugar es obligatorio' })
  @MinLength(3, { message: 'El lugar debe tener al menos 3 caracteres' })
  @MaxLength(300, { message: 'El lugar no puede exceder 300 caracteres' })
  lugar!: string;

  @ApiPropertyOptional({ description: 'Dirección', example: 'Av. 5 de Julio' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(500, { message: 'La dirección no puede exceder 500 caracteres' })
  direccion?: string;

  @ApiProperty({ description: 'Qué necesitan', example: 'Agua potable, alimentos, medicamentos' })
  @IsString({ message: 'El campo que_necesitan debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo que_necesitan es obligatorio' })
  @MinLength(10, { message: 'El campo que_necesitan debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'El campo que_necesitan no puede exceder 1000 caracteres' })
  que_necesitan!: string;

  @ApiPropertyOptional({ description: 'Contacto', example: '+584121234567' })
  @IsString({ message: 'El contacto debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(150, { message: 'El contacto no puede exceder 150 caracteres' })
  contacto?: string;

  @ApiPropertyOptional({ description: 'Indica si está verificado', example: false })
  @IsBoolean({ message: 'El campo verificado debe ser booleano' })
  @IsOptional()
  verificado?: boolean;

  @ApiPropertyOptional({ description: 'UUID del administrador que lo verificó' })
  @IsUUID('4', { message: 'El verificado_por debe ser un UUID válido' })
  @IsOptional()
  verificado_por?: string;
}
