import { Type } from 'class-transformer';
import {
  IsArray, IsInt, IsNumber, IsOptional,
  IsPositive, IsString, ValidateNested,
} from 'class-validator';

export class DetalleMermaItemDto {
  @IsInt() ID_Producto: number;
  @IsInt() ID_Almacen: number;
  @IsNumber() @IsPositive() Cantidad: number;
}

export class CreateMermaDto {
  @IsString() MotivoPerdida: string;

  @IsOptional() @IsString() Fecha?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleMermaItemDto)
  detalles: DetalleMermaItemDto[];
}
