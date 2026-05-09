import { LogisticsCatalogService } from './logistics-catalog.service';
export declare class LogisticsCatalogController {
    private readonly svc;
    constructor(svc: LogisticsCatalogService);
    getProveedores(): Promise<import("../payments/entities/proveedor.entity").Proveedor[]>;
    createProveedor(dto: any): Promise<{
        Estado: string;
        Nombre_RazonSocial: string;
        NIT: string;
        Telefono?: string;
        Direccion?: string;
    } & import("../payments/entities/proveedor.entity").Proveedor>;
    updateProveedor(id: number, dto: any): Promise<{
        Nombre_RazonSocial: string;
        NIT: string;
        Telefono: string;
        Direccion: string;
        Estado: string;
        ID_Proveedor: number;
        deleted_at: Date;
    } & import("../payments/entities/proveedor.entity").Proveedor>;
    removeProveedor(id: number): Promise<{
        message: string;
    }>;
    getVehiculos(): Promise<import("./entities/vehiculo.entity").Vehiculo[]>;
    createVehiculo(dto: any): Promise<{
        Estado: string;
        Placa: string;
        Marca: string;
        Modelo: string;
        Capacidad_Carga: number;
    } & import("./entities/vehiculo.entity").Vehiculo>;
    updateVehiculo(id: number, dto: any): Promise<{
        Placa: string;
        Marca: string;
        Modelo: string;
        Capacidad_Carga: number;
        Estado: string;
        ID_Vehiculo: number;
        ID_Empleado: number;
        empleado: import("../auth/entities/empleado.entity").Empleado;
        deleted_at: Date;
    } & import("./entities/vehiculo.entity").Vehiculo>;
    removeVehiculo(id: number): Promise<{
        message: string;
    }>;
    getRutas(): Promise<import("./entities/ruta.entity").Ruta[]>;
    createRuta(dto: any): Promise<import("./dto/create-ruta-catalog.dto").CreateRutaCatalogDto & import("./entities/ruta.entity").Ruta>;
    updateRuta(id: number, dto: any): Promise<{
        Nombre_Ruta: string;
        Origen: string;
        Destino: string;
        Distancia_KM: number;
        Tiempo_Estimado_Horas: number;
        ID_Ruta: number;
        LatitudOrigen: number;
        LongitudOrigen: number;
        LatitudDestino: number;
        LongitudDestino: number;
        ID_Almacen: number;
        ID_Sucursal: number;
        almacen: import("../warehouse/entities/almacen.entity").Almacen;
        sucursal: import("./entities/sucursal.entity").Sucursal;
        deleted_at: Date;
    } & import("./entities/ruta.entity").Ruta>;
    removeRuta(id: number): Promise<{
        message: string;
    }>;
}
