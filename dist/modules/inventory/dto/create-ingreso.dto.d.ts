export declare class DetalleIngresoItemDto {
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
}
export declare class CreateIngresoDto {
    ID_Compra?: number;
    Descripcion?: string;
    Fecha?: string;
    Hora?: string;
    detalles: DetalleIngresoItemDto[];
}
