import { Empleado } from '../../auth/entities/empleado.entity';
export declare class Vehiculo {
    ID_Vehiculo: number;
    Placa: string;
    Marca: string;
    Modelo: string;
    Capacidad_Carga: number;
    Estado: string;
    ID_Empleado: number;
    empleado: Empleado;
    deleted_at: Date;
}
