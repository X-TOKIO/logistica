import { NotaCompra } from './nota-compra.entity';
import { Producto } from '../../warehouse/entities/producto.entity';
export declare class DetalleCompra {
    ID_Detalle: number;
    Cantidad: number;
    Precio_Unitario: number;
    Subtotal: number;
    Fecha_Elaboracion: Date | null;
    Fecha_Vencimiento: Date | null;
    ID_Compra: number;
    ID_Producto: number;
    notaCompra: NotaCompra;
    producto: Producto;
}
