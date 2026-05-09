export class CreateSucursalDto {
  Nombre: string;
  Direccion: string;
  Telefono?: string;
  StockCritico?: number;
  Latitud?: number;
  Longitud?: number;
}

export class UpdateSucursalDto {
  Nombre?: string;
  Direccion?: string;
  Telefono?: string;
  StockCritico?: number;
  Latitud?: number;
  Longitud?: number;
}
