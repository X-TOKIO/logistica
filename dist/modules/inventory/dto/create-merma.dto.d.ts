export declare class DetalleMermaItemDto {
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
}
export declare class CreateMermaDto {
    MotivoPerdida: string;
    Fecha?: string;
    detalles: DetalleMermaItemDto[];
}
