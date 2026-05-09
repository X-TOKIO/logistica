import { Type } from 'class-transformer';
import {
  IsArray, IsInt, IsNumber, IsOptional,
  IsPositive, IsString, ValidateNested,
} from 'class-validator';

export class DetalleIngresoItemDto {
  @IsInt() ID_Producto: number;
  @IsInt() ID_Almacen: number;
  @IsNumber() @IsPositive() Cantidad: number;
}

export class CreateIngresoDto {
  @IsOptional() @IsInt() ID_Compra?: number;

  @IsOptional() @IsString() Descripcion?: string;
  @IsOptional() @IsString() Fecha?: string;
  @IsOptional() @IsString() Hora?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleIngresoItemDto)
  detalles: DetalleIngresoItemDto[];
}
