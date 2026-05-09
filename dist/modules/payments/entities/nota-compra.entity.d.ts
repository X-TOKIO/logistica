import { Empleado } from '../../auth/entities/empleado.entity';
import { Proveedor } from './proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';
import { Almacen } from '../../warehouse/entities/almacen.entity';
export declare class NotaCompra {
    ID_Compra: number;
    Fecha_Emision: Date;
    Hora_Emision: string;
    ID_Almacen: number;
    almacen: Almacen;
    Costo_Envio: number;
    Monto_Total: number;
    Estado_Documento: string;
    Condicion_Pago: string;
    Nro_Factura: string;
    Ref_Libelula: string | null;
    Id_Libelula: string | null;
    Codigo_Recaudacion: string | null;
    Refs_Previas: string | null;
    Qr_Url: string | null;
    ID_Proveedor: number;
    ID_Empleado: number;
    proveedor: Proveedor;
    empleado: Empleado;
    detalles: DetalleCompra[];
    deleted_at: Date;
}
