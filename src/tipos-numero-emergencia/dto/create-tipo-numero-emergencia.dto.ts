import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTipoNumeroEmergenciaDto {
  @ApiProperty({ description: 'Nombre del tipo', example: 'Bomberos' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre!: string;

  @ApiProperty({ description: 'Slug único', example: 'bomberos' })
  @IsString({ message: 'El slug debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @MinLength(3, { message: 'El slug debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El slug no puede exceder 100 caracteres' })
  slug!: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 0 })
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden no puede ser negativo' })
  @IsOptional()
  orden?: number;
}
