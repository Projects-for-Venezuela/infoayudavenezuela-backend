import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsIn,
  MinLength,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

const ESTATUS_VALIDOS = ['DESCONOCIDO', 'ESTABLE', 'GRAVE', 'CRITICO', 'FALLECIDO', 'ALTA'] as const;

export class CreatePacienteDto {
  @ApiProperty({ description: 'Nombre del paciente', example: 'María Pérez' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del paciente es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre_paciente!: string;

  @ApiProperty({ description: 'ID del estado (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estado_id es obligatorio' })
  estado_id!: string;

  @ApiProperty({ description: 'ID de la ciudad (UUID)', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ciudad_id es obligatorio' })
  ciudad_id!: string;

  @ApiPropertyOptional({ description: 'ID del hospital (UUID)', example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' })
  @IsUUID('4', { message: 'El hospital_id debe ser un UUID válido' })
  @IsOptional()
  hospital_id?: string;

  @ApiPropertyOptional({ description: 'Nombre del hospital (libre)', example: 'Hospital de campaña' })
  @IsString({ message: 'El hospital_nombre_libre debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(200, { message: 'El hospital_nombre_libre no puede exceder 200 caracteres' })
  hospital_nombre_libre?: string;

  @ApiPropertyOptional({ description: 'Cédula de identidad', example: 'V-12345678' })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(20, { message: 'La cédula no puede exceder 20 caracteres' })
  cedula?: string;

  @ApiPropertyOptional({ description: 'Contacto', example: '+584121234567' })
  @IsString({ message: 'El contacto debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(150, { message: 'El contacto no puede exceder 150 caracteres' })
  contacto?: string;

  @ApiPropertyOptional({ description: 'Insumos que necesitan', example: ['Medicamentos', 'Sueros'] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) {
      return value.map((item: unknown) => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
    }
    if (typeof value !== 'string') return value;
    return value.split(',').map((item: string) => item.trim()).filter(Boolean);
  })
  @IsArray({ message: 'necesitan debe ser una lista de valores' })
  @ArrayMaxSize(30, { message: 'necesitan no puede tener más de 30 elementos' })
  @IsString({ each: true, message: 'Cada elemento de necesitan debe ser un texto' })
  @MaxLength(100, { each: true, message: 'Cada elemento de necesitan no puede superar los 100 caracteres' })
  necesitan?: string[];

  @ApiPropertyOptional({ description: 'Estatus del paciente', example: 'DESCONOCIDO', enum: ESTATUS_VALIDOS })
  @IsString({ message: 'El estatus debe ser una cadena de texto' })
  @IsIn([...ESTATUS_VALIDOS], { message: `El estatus debe ser uno de: ${ESTATUS_VALIDOS.join(', ')}` })
  @IsOptional()
  estatus?: string;

  @ApiPropertyOptional({ description: 'Indica si está verificado', example: false })
  @IsBoolean({ message: 'El campo verificado debe ser booleano' })
  @IsOptional()
  verificado?: boolean;

  @ApiPropertyOptional({ description: 'UUID del administrador que lo verificó' })
  @IsUUID('4', { message: 'El verificado_por debe ser un UUID válido' })
  @IsOptional()
  verificado_por?: string;
}
