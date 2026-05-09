import { CuentaPorPagar } from './cuenta-por-pagar.entity';
export declare class CuotaCxP {
    ID_CuotaCxP: number;
    ID_Cuenta: number;
    Numero_Cuota: number;
    Fecha_Vencimiento: Date;
    Monto: number;
    Estado: string;
    cuentaPorPagar: CuentaPorPagar;
}
