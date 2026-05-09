import { Empleado } from '../../auth/entities/empleado.entity';
import { DetalleMerma } from './detalle-merma.entity';
export declare class Mermas {
    ID_Merma: number;
    Fecha: Date;
    MotivoPerdida: string;
    ID_Empleado: number;
    empleado: Empleado;
    detalles: DetalleMerma[];
    deleted_at: Date;
}
