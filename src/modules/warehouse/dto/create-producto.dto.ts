export class CreateProductoDto {
  Nombre: string;
  CodigoBarra?: string;
  Descripcion?: string;
  FechaVencimiento?: string;
  Fecha_Elaboracion?: string;
  Image?: string;
  Ubicacion?: string;
  PrecioUnitario: number;
  ID_Medida: number;
  ID_Categoria: number;
}

export class UpdateProductoDto {
  Nombre?: string;
  CodigoBarra?: string;
  Descripcion?: string;
  FechaVencimiento?: string;
  Fecha_Elaboracion?: string;
  Image?: string;
  Ubicacion?: string;
  PrecioUnitario?: number;
  ID_Medida?: number;
  ID_Categoria?: number;
}
