import { Almacen } from '../../warehouse/entities/almacen.entity';
import { Sucursal } from './sucursal.entity';
export declare class Ruta {
    ID_Ruta: number;
    Nombre_Ruta: string;
    Origen: string;
    Destino: string;
    Distancia_KM: number;
    Tiempo_Estimado_Horas: number;
    LatitudOrigen: number;
    LongitudOrigen: number;
    LatitudDestino: number;
    LongitudDestino: number;
    ID_Almacen: number;
    ID_Sucursal: number;
    almacen: Almacen;
    sucursal: Sucursal;
    deleted_at: Date;
}
