import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreateNoticiaDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres.' })
  @MaxLength(300, { message: 'El título no puede exceder 300 caracteres.' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
  @MaxLength(5000, { message: 'La descripción no puede exceder 5000 caracteres.' })
  descripcion: string;

  @IsOptional()
  @IsString({ message: 'La fuente debe ser una cadena de texto.' })
  @MaxLength(500, { message: 'La fuente no puede exceder 500 caracteres.' })
  fuente?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El campo estado_id debe ser un UUID válido.' })
  estado_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El campo ciudad_id debe ser un UUID válido.' })
  ciudad_id?: string;

  @IsOptional()
  @IsIn(['pendiente', 'publicada', 'archivada'], { message: 'Estado inválido. Valores permitidos: pendiente, publicada, archivada.' })
  estado?: string;
}
