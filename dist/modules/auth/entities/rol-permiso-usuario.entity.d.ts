import { RolPermiso } from './rol-permiso.entity';
import { Usuario } from './usuario.entity';
export declare class RolPermisoUsuario {
    ID_Rol: number;
    ID_Permiso: number;
    ID_Usuario: number;
    fecha_asignacion: Date;
    rolPermiso: RolPermiso;
    usuario: Usuario;
    deleted_at: Date;
}
