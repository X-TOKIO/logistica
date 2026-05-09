import { Empleado } from '../../auth/entities/empleado.entity';
export declare class Camion {
    ID_Camion: number;
    Placa: string;
    Modelo: string;
    CapacidadCarga: number;
    Estado: string;
    ID_Empleado: number;
    empleado: Empleado;
    deleted_at: Date;
}
