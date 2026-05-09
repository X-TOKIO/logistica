import { LogisticsService } from './logistics.service';
export declare class LogisticsController {
    private readonly srv;
    constructor(srv: LogisticsService);
    getPendientes(): Promise<import("../inventory/entities/nota-egreso.entity").NotaEgreso[]>;
    getAuxiliares(): Promise<{
        rutas: import("./entities/ruta.entity").Ruta[];
        camiones: (import("./entities/camion.entity").Camion | {
            ID_Camion: number;
            Placa: string;
            Modelo: string;
            CapacidadCarga: number;
            Estado: string;
            ID_Empleado: number;
            empleado: import("../auth/entities/empleado.entity").Empleado;
            _fromCatalog: boolean;
        })[];
    }>;
    createDespacho(dto: any): Promise<{
        FechaSalida: Date;
        FechaEntregaEstimada: Date;
        FechaHora_Salida: Date;
        FechaHora_Estimada_Entrega: Date;
        ID_Egreso: any;
        ID_Ruta: any;
    } & import("./entities/despacho.entity").Despacho>;
    getActivos(req: any): Promise<import("./entities/despacho-camion.entity").DespachoCamion[]>;
    addTracking(dto: any): Promise<{
        Latitud: any;
        Longitud: any;
        FechaHora: Date;
        ID_Despacho: any;
    } & import("./entities/tracking-gps.entity").TrackingGPS>;
    getHistorial(req: any): Promise<import("./entities/despacho-camion.entity").DespachoCamion[]>;
    getLatestTracking(): Promise<import("./entities/tracking-gps.entity").TrackingGPS[]>;
    updateDespachoProgreso(id: number, body: {
        progreso: number;
        estado: string;
    }): Promise<{
        ok: boolean;
        ID_Despacho: number;
        progreso: number;
        estado: string;
    }>;
    updateVehicleEstado(id: number, estado: string): Promise<{
        ok: boolean;
        ID_Camion: number;
        estado: string;
    }>;
}
