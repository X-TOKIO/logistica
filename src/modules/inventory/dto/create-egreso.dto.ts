import { Type } from 'class-transformer';
import {
  IsArray, IsInt, IsNumber, IsOptional,
  IsPositive, IsString, ValidateNested,
} from 'class-validator';

export class DetalleEgresoItemDto {
  @IsInt() ID_Producto: number;
  @IsInt() ID_Almacen: number;
  @IsNumber() @IsPositive() Cantidad: number;
  @IsOptional() @IsInt() ID_Sucursal?: number;
}

export class CreateEgresoDto {
  @IsOptional() @IsString() Descripcion?: string;
  @IsOptional() @IsString() Fecha?: string;
  @IsOptional() @IsString() Hora?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleEgresoItemDto)
  detalles: DetalleEgresoItemDto[];
}
