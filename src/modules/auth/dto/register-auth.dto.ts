import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsNumber, IsOptional } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  UserName: string;

  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número o carácter especial',
  })
  Password: string;

  @IsNumber()
  @IsNotEmpty()
  ID_Empleado: number;

  @IsOptional()
  @IsNumber()
  ID_Rol?: number;
}
