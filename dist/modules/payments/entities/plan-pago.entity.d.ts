import { PagoLegado } from './pago-legado.entity';
export declare class PlanPago {
    ID_Pago: number;
    ID_Cuota: number;
    Fecha: Date;
    Monto: number;
    Estado: string;
    pago: PagoLegado;
    deleted_at: Date;
}
