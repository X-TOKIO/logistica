export class CreateMedidaDto {
  Nombre: string;
  Abreviatura: string;
  Unidades_Bulto: string;
  factor_conversion?: number;
}

export class UpdateMedidaDto {
  Nombre?: string;
  Abreviatura?: string;
  Unidades_Bulto?: string;
  factor_conversion?: number;
}
