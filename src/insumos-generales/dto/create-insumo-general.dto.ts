import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInsumoGeneralDto {
  @ApiProperty({ description: 'Nombre del insumo', example: 'Agua embotellada' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 0 })
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden no puede ser negativo' })
  @IsOptional()
  orden?: number;
}
