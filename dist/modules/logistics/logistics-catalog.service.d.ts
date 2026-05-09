import { Repository } from 'typeorm';
import { Proveedor } from '../payments/entities/proveedor.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Ruta } from './entities/ruta.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { CreateRutaCatalogDto } from './dto/create-ruta-catalog.dto';
import { UpdateRutaCatalogDto } from './dto/update-ruta-catalog.dto';
export declare class LogisticsCatalogService {
    private provRepo;
    private vehiculoRepo;
    private rutaRepo;
    constructor(provRepo: Repository<Proveedor>, vehiculoRepo: Repository<Vehiculo>, rutaRepo: Repository<Ruta>);
    getProveedores(): Promise<Proveedor[]>;
    createProveedor(dto: CreateProveedorDto): Promise<{
        Estado: string;
        Nombre_RazonSocial: string;
        NIT: string;
        Telefono?: string;
        Direccion?: string;
    } & Proveedor>;
    updateProveedor(id: number, dto: UpdateProveedorDto): Promise<{
        Nombre_RazonSocial: string;
        NIT: string;
        Telefono: string;
        Direccion: string;
        Estado: string;
        ID_Proveedor: number;
        deleted_at: Date;
    } & Proveedor>;
    removeProveedor(id: number): Promise<{
        message: string;
    }>;
    getVehiculos(): Promise<Vehiculo[]>;
    createVehiculo(dto: CreateVehiculoDto): Promise<{
        Estado: string;
        Placa: string;
        Marca: string;
        Modelo: string;
        Capacidad_Carga: number;
    } & Vehiculo>;
    updateVehiculo(id: number, dto: UpdateVehiculoDto): Promise<{
        Placa: string;
        Marca: string;
        Modelo: string;
        Capacidad_Carga: number;
        Estado: string;
        ID_Vehiculo: number;
        ID_Empleado: number;
        empleado: import("../auth/entities/empleado.entity").Empleado;
        deleted_at: Date;
    } & Vehiculo>;
    removeVehiculo(id: number): Promise<{
        message: string;
    }>;
    getRutas(): Promise<Ruta[]>;
    createRuta(dto: CreateRutaCatalogDto): Promise<CreateRutaCatalogDto & Ruta>;
    updateRuta(id: number, dto: UpdateRutaCatalogDto): Promise<{
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
    } & Ruta>;
    removeRuta(id: number): Promise<{
        message: string;
    }>;
}
