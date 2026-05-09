import { NotaEgreso } from '../../inventory/entities/nota-egreso.entity';
import { Ruta } from './ruta.entity';
import { TrackingGPS } from './tracking-gps.entity';
export declare class Despacho {
    ID_Despacho: number;
    FechaSalida: Date;
    FechaEntregaEstimada: Date;
    FechaHora_Salida: Date;
    FechaHora_Estimada_Entrega: Date;
    ID_Egreso: number;
    ID_Ruta: number;
    Estado_Despacho: string;
    Progreso_Porcentaje: number;
    Ultima_Actualizacion_Ms: number | null;
    notaEgreso: NotaEgreso;
    ruta: Ruta;
    trackings: TrackingGPS[];
    deleted_at: Date;
}
