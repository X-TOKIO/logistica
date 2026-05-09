export declare class DetalleEgresoItemDto {
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
    ID_Sucursal?: number;
}
export declare class CreateEgresoDto {
    Descripcion?: string;
    Fecha?: string;
    Hora?: string;
    detalles: DetalleEgresoItemDto[];
}
