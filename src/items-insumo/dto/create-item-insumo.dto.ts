import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemInsumoDto {
  @ApiProperty({ description: 'Nombre del item', example: 'Paracetamol 500mg' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre!: string;

  @ApiProperty({ description: 'ID de la categoría (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El categoria_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El categoria_id es obligatorio' })
  categoria_id!: string;

  @ApiPropertyOptional({ description: 'Descripción del item', example: 'Analgésico de venta libre' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden no puede ser negativo' })
  @IsOptional()
  orden?: number;
}
