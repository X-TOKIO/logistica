import { Empleado } from '../../auth/entities/empleado.entity';
import { NotaCompra } from '../../payments/entities/nota-compra.entity';
import { DetalleIngreso } from './detalle-ingreso.entity';
export declare class NotaIngreso {
    ID_Ingreso: number;
    Fecha: Date;
    Hora: string;
    Descripcion: string;
    Nombre: string;
    ID_Compra: number | null;
    ID_Empleado: number;
    compra: NotaCompra;
    empleado: Empleado;
    detalles: DetalleIngreso[];
    deleted_at: Date;
}
