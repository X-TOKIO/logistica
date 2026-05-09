import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional() @IsString() Nombre?: string;
  @IsOptional() @IsString() Paterno?: string;
  @IsOptional() @IsEmail() Email?: string;
  @IsOptional() @IsNumber() ID_Rol?: number;
  @IsOptional() @IsString() @MinLength(8) NewPassword?: string;
}

export class UpdateSelfProfileDto {
  @IsOptional() @IsString() Nombre?: string;
  @IsOptional() @IsString() Paterno?: string;
  @IsOptional() @IsEmail() Email?: string;
  @IsOptional() @IsString() @MinLength(8) NewPassword?: string;
}
