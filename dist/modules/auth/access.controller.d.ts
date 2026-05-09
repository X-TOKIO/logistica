import { AuthService } from './auth.service';
export declare class AccessController {
    private readonly authService;
    constructor(authService: AuthService);
    getUsers(): Promise<import("./entities/usuario.entity").Usuario[]>;
    getMatrix(): Promise<{
        roles: import("./entities/rol.entity").Rol[];
        permisos: import("./entities/permiso.entity").Permiso[];
    }>;
    getUserMatrix(id: string): Promise<import("./entities/rol-permiso-usuario.entity").RolPermisoUsuario[]>;
    assignRole(body: {
        ID_Usuario: number;
        ID_Rol: number;
        ID_Permiso: number;
    }): Promise<import("./entities/rol-permiso-usuario.entity").RolPermisoUsuario>;
    assignMultiple(body: {
        ID_Usuario: number;
        ID_Rol: number;
        ID_Permisos: number[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    syncPermisos(body: {
        ID_Usuario: number;
        ID_Rol: number;
        ID_Permisos: number[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    revokeRole(body: {
        ID_Usuario: number;
        ID_Rol: number;
        ID_Permiso: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare class RolesController {
    private readonly authService;
    constructor(authService: AuthService);
    getAll(): Promise<{
        permisos: import("./entities/permiso.entity").Permiso[];
        permisoIds: number[];
        ID_Rol: number;
        Nombre: string;
        Descripcion: string;
        rolPermisos: import("./entities/rol-permiso.entity").RolPermiso[];
        deleted_at: Date;
    }[]>;
    getOne(id: string): Promise<import("./entities/rol.entity").Rol | null>;
    getWithPermisos(id: string): Promise<{
        permisoIds: number[];
        ID_Rol?: number | undefined;
        Nombre?: string | undefined;
        Descripcion?: string | undefined;
        rolPermisos?: import("./entities/rol-permiso.entity").RolPermiso[] | undefined;
        deleted_at?: Date | undefined;
    }>;
    create(body: {
        nombre: string;
        descripcion?: string;
        permisos?: number[];
    }): Promise<{
        Nombre: string;
        Descripcion: string;
    } & import("./entities/rol.entity").Rol>;
    update(id: string, body: {
        nombre: string;
        descripcion?: string;
        permisos?: number[];
    }, req: any): Promise<{
        permisoIds: number[];
        ID_Rol?: number | undefined;
        Nombre?: string | undefined;
        Descripcion?: string | undefined;
        rolPermisos?: import("./entities/rol-permiso.entity").RolPermiso[] | undefined;
        deleted_at?: Date | undefined;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
export declare class PermisosController {
    private readonly authService;
    constructor(authService: AuthService);
    getAll(): Promise<import("./entities/permiso.entity").Permiso[]>;
}
