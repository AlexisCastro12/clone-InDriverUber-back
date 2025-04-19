import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  //@MinLength(6, {message: 'la contraseña debe tener minimo 6 caracteres'})
  password: string;

  @IsArray()
  @IsString({ each: true }) // "each" indica a class-validator aplica la validacion para cada item del array
  @ArrayMinSize(1)
  @IsOptional()
  rolesIds?: string[]; //["ADMIN", "CLIENT",...]
}
