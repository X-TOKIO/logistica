import { Empleado } from './empleado.entity';
import { RolPermisoUsuario } from './rol-permiso-usuario.entity';
export declare class Usuario {
    ID_Usuario: number;
    UserName: string;
    Password: string;
    Email: string;
    Estado: string;
    intentosFallidos: number;
    bloqueadoHasta: Date | null;
    ultimoLogin: Date | null;
    ID_Empleado: number;
    ID_Rol: number | null;
    empleado: Empleado;
    asignaciones: RolPermisoUsuario[];
    deleted_at: Date;
}
