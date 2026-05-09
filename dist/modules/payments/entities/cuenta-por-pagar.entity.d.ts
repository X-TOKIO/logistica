import { NotaCompra } from './nota-compra.entity';
import { CuotaCxP } from './cuota-cxp.entity';
export declare class CuentaPorPagar {
    ID_Cuenta: number;
    Saldo_Pendiente: number;
    Fecha_Vencimiento: Date;
    Estado_Pago: string;
    ID_Compra: number;
    notaCompra: NotaCompra;
    cuotas: CuotaCxP[];
    deleted_at: Date;
}
