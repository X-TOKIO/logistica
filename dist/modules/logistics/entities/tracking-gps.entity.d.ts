import { Despacho } from './despacho.entity';
export declare class TrackingGPS {
    ID_Tracking: number;
    Latitud: number;
    Longitud: number;
    FechaHora: Date;
    ID_Despacho: number;
    despacho: Despacho;
    deleted_at: Date;
}
