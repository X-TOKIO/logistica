export class CreateAlmacenDto {
  Nombre: string;
  Direccion: string;
  Latitud?: number;
  Longitud?: number;
}

export class UpdateAlmacenDto {
  Nombre?: string;
  Direccion?: string;
  Latitud?: number;
  Longitud?: number;
}
