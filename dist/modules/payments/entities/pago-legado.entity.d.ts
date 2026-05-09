import { NotaCompra } from './nota-compra.entity';
export declare class PagoLegado {
    ID_Pago: number;
    Fecha: Date;
    Plazo: number;
    MontoTotal: number;
    ID_Compra: number;
    notaCompra: NotaCompra;
    deleted_at: Date;
}
