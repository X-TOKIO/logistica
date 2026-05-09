import { CuentaPorPagar } from './cuenta-por-pagar.entity';
import { Empleado } from '../../auth/entities/empleado.entity';
export declare class Pago {
    ID_Pago: number;
    Monto_Pagado: number;
    Fecha_Pago: Date;
    Metodo_Pago: 'EFECTIVO' | 'QR';
    Referencia_Comprobante: string;
    Observaciones: string;
    ID_Cuenta: number;
    cuentaPorPagar: CuentaPorPagar;
    ID_Empleado: number;
    empleado: Empleado;
    deleted_at: Date;
}
