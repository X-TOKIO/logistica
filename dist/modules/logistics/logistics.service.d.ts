import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotaEgreso } from '../inventory/entities/nota-egreso.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Ruta } from './entities/ruta.entity';
import { Camion } from './entities/camion.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Despacho } from './entities/despacho.entity';
import { DespachoCamion } from './entities/despacho-camion.entity';
import { TrackingGPS } from './entities/tracking-gps.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { Almacen } from '../warehouse/entities/almacen.entity';
export declare class LogisticsService implements OnApplicationBootstrap {
    private sucRepo;
    private rutaRepo;
    private camRepo;
    private vehiculoRepo;
    private desRepo;
    private dcRepo;
    private trackRepo;
    private egrRepo;
    private usrRepo;
    private almRepo;
    private dataSource;
    private readonly logger;
    constructor(sucRepo: Repository<Sucursal>, rutaRepo: Repository<Ruta>, camRepo: Repository<Camion>, vehiculoRepo: Repository<Vehiculo>, desRepo: Repository<Despacho>, dcRepo: Repository<DespachoCamion>, trackRepo: Repository<TrackingGPS>, egrRepo: Repository<NotaEgreso>, usrRepo: Repository<Usuario>, almRepo: Repository<Almacen>, dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    getPendientes(): Promise<NotaEgreso[]>;
    getRutas(): Promise<Ruta[]>;
    getCamiones(): Promise<(Camion | {
        ID_Camion: number;
        Placa: string;
        Modelo: string;
        CapacidadCarga: number;
        Estado: string;
        ID_Empleado: number;
        empleado: import("../auth/entities/empleado.entity").Empleado;
        _fromCatalog: boolean;
    })[]>;
    createDespacho(dto: any): Promise<{
        FechaSalida: Date;
        FechaEntregaEstimada: Date;
        FechaHora_Salida: Date;
        FechaHora_Estimada_Entrega: Date;
        ID_Egreso: any;
        ID_Ruta: any;
    } & Despacho>;
    getDespachosActivos(userId: number, roles: string[]): Promise<DespachoCamion[]>;
    getHistorial(userId?: number, roles?: string[]): Promise<DespachoCamion[]>;
    addTracking(dto: any): Promise<{
        Latitud: any;
        Longitud: any;
        FechaHora: Date;
        ID_Despacho: any;
    } & TrackingGPS>;
    getLatestTracking(): Promise<TrackingGPS[]>;
    updateDespachoProgreso(id: number, progreso: number, estado: string): Promise<{
        ok: boolean;
        ID_Despacho: number;
        progreso: number;
        estado: string;
    }>;
    updateVehicleEstado(camionId: number, estado: string): Promise<{
        ok: boolean;
        ID_Camion: number;
        estado: string;
    }>;
}
