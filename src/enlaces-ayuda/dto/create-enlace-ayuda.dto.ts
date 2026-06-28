import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsUrl, IsUUID } from 'class-validator';

export class CreateEnlaceAyudaDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @MaxLength(300, { message: 'El título no puede exceder 300 caracteres.' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
  @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres.' })
  descripcion: string;

  @IsString({ message: 'La URL debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La URL es obligatoria.' })
  @IsUrl({}, { message: 'La URL proporcionada no es válida.' })
  url: string;

  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  @MaxLength(100, { message: 'La categoría no puede exceder 100 caracteres.' })
  categoria: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo verificado debe ser booleano.' })
  verificado?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'El campo verificado_por debe ser un UUID válido.' })
  verificado_por?: string;
}
