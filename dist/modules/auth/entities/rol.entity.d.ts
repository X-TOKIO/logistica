import { RolPermiso } from './rol-permiso.entity';
export declare class Rol {
    ID_Rol: number;
    Nombre: string;
    Descripcion: string;
    rolPermisos: RolPermiso[];
    deleted_at: Date;
}
