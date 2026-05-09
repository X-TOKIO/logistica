import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';
export declare class RolPermiso {
    ID_Rol: number;
    ID_Permiso: number;
    rol: Rol;
    permiso: Permiso;
    deleted_at: Date;
}
