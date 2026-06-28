import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { CategoriaNecesidad } from 'generated/prisma/client';

export class CreateNecesidadeDto {
  @ApiProperty({
    description: 'ID (UUID) del estado afectado',
    format: 'uuid',
    example: '3f0c1a2b-4d5e-6789-abcd-ef0123456789',
  })
  @IsUUID()
  estado_id!: string;

  @ApiProperty({
    description: 'ID (UUID) de la ciudad afectada',
    format: 'uuid',
    example: '9a8b7c6d-5e4f-3210-fedc-ba9876543210',
  })
  @IsUUID()
  ciudad_id!: string;

  @ApiProperty({
    description: 'Lugar o punto de referencia de la necesidad',
    example: 'Plaza Bolívar, sector centro',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  lugar!: string;

  @ApiPropertyOptional({
    description: 'Dirección exacta (opcional)',
    example: 'Av. Principal con calle 5, casa #12',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @Length(2, 300)
  direccion?: string;

  @ApiProperty({
    description: 'Categorías de la necesidad',
    enum: CategoriaNecesidad,
    isArray: true,
    example: [CategoriaNecesidad.AGUA_ALIMENTOS, CategoriaNecesidad.MEDICINAS],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(CategoriaNecesidad, { each: true })
  categoria_necesidad!: CategoriaNecesidad[];

  @ApiProperty({
    description: 'Descripción de lo que se necesita',
    example: 'Agua potable y alimentos no perecederos para 30 familias',
    minLength: 2,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 1000)
  que_necesitan!: string;

  @ApiPropertyOptional({
    description: 'Datos de contacto del solicitante (opcional)',
    example: '+58 412-1234567',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  contacto?: string;
}
