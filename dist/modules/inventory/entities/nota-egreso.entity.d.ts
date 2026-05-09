import { Empleado } from '../../auth/entities/empleado.entity';
import { DetalleEgreso } from './detalle-egreso.entity';
export declare class NotaEgreso {
    ID_Egreso: number;
    Fecha: Date;
    Hora: string;
    Descripcion: string;
    MontoTotal: number;
    ID_Empleado: number;
    empleado: Empleado;
    detalles: DetalleEgreso[];
    deleted_at: Date;
}
