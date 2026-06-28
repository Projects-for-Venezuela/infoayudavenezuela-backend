import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateRefugiadoDto {
  @ApiProperty({ description: 'Nombre completo del refugiado', example: 'Juan Carlos Pérez' })
  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MinLength(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre completo no puede exceder 200 caracteres' })
  nombre_completo!: string;

  @ApiPropertyOptional({ description: 'Cédula de identidad', example: 'V-12345678' })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(20, { message: 'La cédula no puede exceder 20 caracteres' })
  cedula?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono', example: '+584121234567' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'ID del refugio donde se encuentra (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: 'El refugio_id debe ser un UUID válido' })
  @IsOptional()
  refugio_id?: string;

  @ApiPropertyOptional({ description: 'Estado de salud del refugiado', example: 'Estable' })
  @IsString({ message: 'El estado de salud debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(200, { message: 'El estado de salud no puede exceder 200 caracteres' })
  estado_salud?: string;

  @ApiPropertyOptional({ description: 'Necesidades específicas', example: 'Requiere medicamentos para hipertensión' })
  @IsString({ message: 'Las necesidades específicas deben ser una cadena de texto' })
  @IsOptional()
  @MaxLength(500, { message: 'Las necesidades específicas no pueden exceder 500 caracteres' })
  necesidades_especificas?: string;

  @ApiPropertyOptional({ description: 'Indica si está verificado', example: false })
  @IsBoolean({ message: 'El campo verificado debe ser un valor booleano (true o false)' })
  @IsOptional()
  verificado?: boolean;

  @ApiPropertyOptional({
    description: 'UUID del administrador que lo verificó',
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  })
  @IsUUID('4', { message: 'El verificado_por debe ser un UUID válido' })
  @IsOptional()
  verificado_por?: string;
}
