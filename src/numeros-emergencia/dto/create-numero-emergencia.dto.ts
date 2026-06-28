import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNumeroEmergenciaDto {
  @ApiProperty({ description: 'Nombre del contacto', example: 'Bomberos de Caracas' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Número telefónico', example: '0212-5551234' })
  @IsString({ message: 'El número debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(50, { message: 'El número no puede exceder 50 caracteres' })
  numero?: string;

  @ApiPropertyOptional({ description: 'ID del estado (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  @IsOptional()
  estado_id?: string;

  @ApiPropertyOptional({ description: 'ID de la ciudad (UUID)', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  @IsOptional()
  ciudad_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de número (UUID)', example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' })
  @IsUUID('4', { message: 'El tipo_id debe ser un UUID válido' })
  @IsOptional()
  tipo_id?: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden no puede ser negativo' })
  @IsOptional()
  orden?: number;

  @ApiPropertyOptional({ description: 'Indica si está verificado', example: true })
  @IsBoolean({ message: 'El campo verificado debe ser booleano' })
  @IsOptional()
  verificado?: boolean;

  @ApiPropertyOptional({ description: 'UUID del administrador que lo verificó' })
  @IsUUID('4', { message: 'El verificado_por debe ser un UUID válido' })
  @IsOptional()
  verificado_por?: string;
}
