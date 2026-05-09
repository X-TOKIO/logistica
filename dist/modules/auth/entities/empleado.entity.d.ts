import { Usuario } from './usuario.entity';
export declare class Empleado {
    ID_Empleado: number;
    Nombre: string;
    Materno: string;
    Paterno: string;
    CI: string;
    Telefono: string;
    Direccion: string;
    Cargo: string;
    FechaContratacion: Date;
    Image: string;
    usuario: Usuario;
    deleted_at: Date;
}
