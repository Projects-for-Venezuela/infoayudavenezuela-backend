import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCentroAcopioDto {
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsUUID('4', { message: 'El estado_id debe ser un UUID válido' })
  estado_id!: string;

  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @IsUUID('4', { message: 'El ciudad_id debe ser un UUID válido' })
  ciudad_id!: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  nombre!: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  @MaxLength(250, { message: 'La dirección no puede superar los 250 caracteres' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'El contacto debe ser un texto' })
  @MaxLength(150, { message: 'El contacto no puede superar los 150 caracteres' })
  contacto?: string;

  @IsOptional()
  @IsString({ message: 'La hora debe ser un texto' })
  @MaxLength(100, { message: 'La hora no puede superar los 100 caracteres' })
  hora?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : item))
        .filter((item) => typeof item === 'string' && item.length > 0);
    }

    if (typeof value !== 'string') return value;

    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  })
  @IsArray({ message: 'Acepta debe ser una lista de valores' })
  @ArrayMaxSize(30, { message: 'Acepta no puede tener más de 30 elementos' })
  @IsString({ each: true, message: 'Cada elemento de acepta debe ser un texto' })
  @MinLength(1, { each: true, message: 'Los elementos de acepta no pueden estar vacíos' })
  @MaxLength(100, {
    each: true,
    message: 'Cada elemento de acepta no puede superar los 100 caracteres',
  })
  acepta?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : item))
        .filter((item) => typeof item === 'string' && item.length > 0);
    }

    if (typeof value !== 'string') return value;

    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  })
  @IsArray({ message: 'Necesitan debe ser una lista de valores' })
  @ArrayMaxSize(30, { message: 'Necesitan no puede tener más de 30 elementos' })
  @IsString({ each: true, message: 'Cada elemento de necesitan debe ser un texto' })
  @MinLength(1, { each: true, message: 'Los elementos de necesitan no pueden estar vacíos' })
  @MaxLength(100, {
    each: true,
    message: 'Cada elemento de necesitan no puede superar los 100 caracteres',
  })
  necesitan?: string[];

  @IsOptional()
  @IsString({ message: 'El pago móvil debe ser un texto' })
  @MaxLength(150, { message: 'El pago móvil no puede superar los 150 caracteres' })
  pago_movil?: string;

  @IsOptional()
  @IsString({ message: 'El zelle debe ser un texto' })
  @MaxLength(150, { message: 'El zelle no puede superar los 150 caracteres' })
  zelle?: string;
}
