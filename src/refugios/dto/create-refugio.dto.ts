import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  IsIn,
  MinLength,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

const TIPOS_REFUGIO = ['oficial', 'comunitario', 'improvisado', 'religioso', 'otro'] as const;

export class CreateRefugioDto {
  @ApiProperty({ description: 'Nombre del refugio', example: 'Refugio Central' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del refugio es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre!: string;

  @ApiProperty({ description: 'ID del estado (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estado_id es obligatorio' })
  estado_id!: string;

  @ApiProperty({ description: 'ID de la ciudad (UUID)', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ciudad_id es obligatorio' })
  ciudad_id!: string;

  @ApiPropertyOptional({ description: 'Dirección física', example: 'Av. Principal c/ Calle 3' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(500, { message: 'La dirección no puede exceder 500 caracteres' })
  direccion?: string;

  @ApiPropertyOptional({ description: 'Información de contacto', example: 'Contacto: Juan Pérez +584120000000' })
  @IsString({ message: 'El contacto debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(300, { message: 'El contacto no puede exceder 300 caracteres' })
  contacto?: string;

  @ApiPropertyOptional({ description: 'Capacidad del refugio', example: '30 personas' })
  @IsString({ message: 'La capacidad debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(100, { message: 'La capacidad no puede exceder 100 caracteres' })
  capacidad?: string;

  @ApiPropertyOptional({ description: 'Insumos que acepta', example: ['Comida', 'Ropa'] })
  @IsArray({ message: 'El campo acepta debe ser un arreglo' })
  @IsString({ each: true, message: 'Cada elemento de acepta debe ser una cadena de texto' })
  @ArrayMaxSize(50, { message: 'No puede tener más de 50 elementos en acepta' })
  @IsOptional()
  acepta?: string[];

  @ApiPropertyOptional({ description: 'Insumos que necesita urgentemente', example: ['Agua potable', 'Medicamentos'] })
  @IsArray({ message: 'El campo necesitan debe ser un arreglo' })
  @IsString({ each: true, message: 'Cada elemento de necesitan debe ser una cadena de texto' })
  @ArrayMaxSize(50, { message: 'No puede tener más de 50 elementos en necesitan' })
  @IsOptional()
  necesitan?: string[];

  @ApiPropertyOptional({
    description: 'Tipo de refugio',
    example: 'oficial',
    enum: TIPOS_REFUGIO,
  })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsIn([...TIPOS_REFUGIO], {
    message: `El tipo debe ser uno de: ${TIPOS_REFUGIO.join(', ')}`,
  })
  @IsOptional()
  tipo?: string;

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
