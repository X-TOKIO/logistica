import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { RolPermisoUsuario } from './entities/rol-permiso-usuario.entity';
import { Empleado } from './entities/empleado.entity';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateUsuarioDto, UpdateSelfProfileDto } from './dto/update-usuario.dto';
export declare class AuthService implements OnApplicationBootstrap {
    private readonly usuarioRepo;
    private readonly empleadoRepo;
    private readonly rolPermisoUsuarioRepo;
    private readonly rolRepo;
    private readonly perRepo;
    private readonly rolPerRepo;
    private readonly jwtService;
    private readonly dataSource;
    private readonly logger;
    constructor(usuarioRepo: Repository<Usuario>, empleadoRepo: Repository<Empleado>, rolPermisoUsuarioRepo: Repository<RolPermisoUsuario>, rolRepo: Repository<Rol>, perRepo: Repository<Permiso>, rolPerRepo: Repository<RolPermiso>, jwtService: JwtService, dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    private seedInicial;
    createEmpleado(dto: any): Promise<Empleado>;
    getEmpleados(): Promise<Empleado[]>;
    updateEmpleado(id: number, dto: any): Promise<Empleado | null>;
    deleteEmpleado(id: number): Promise<{
        success: boolean;
    }>;
    register(dto: RegisterAuthDto): Promise<Usuario>;
    private getRolesYPermisos;
    login(dto: LoginAuthDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    refreshToken(userId: number): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    getAllUsers(): Promise<Usuario[]>;
    getMatrix(): Promise<{
        roles: Rol[];
        permisos: Permiso[];
    }>;
    getUserMatrix(userId: number): Promise<RolPermisoUsuario[]>;
    assignRoleAccess(idUsuario: number, idRol: number, idPermiso: number): Promise<RolPermisoUsuario>;
    assignMultipleAccess(idUsuario: number, idRol: number, idPermisos: number[]): Promise<{
        success: boolean;
        message: string;
    }>;
    revokeAccess(idUsuario: number, idRol: number, idPermiso: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllRoles(): Promise<{
        permisos: Permiso[];
        permisoIds: number[];
        ID_Rol: number;
        Nombre: string;
        Descripcion: string;
        rolPermisos: RolPermiso[];
        deleted_at: Date;
    }[]>;
    getRolById(id: number): Promise<Rol | null>;
    createRol(data: {
        nombre: string;
        descripcion?: string;
        permisos?: number[];
    }): Promise<{
        Nombre: string;
        Descripcion: string;
    } & Rol>;
    updateRol(id: number, data: {
        nombre: string;
        descripcion?: string;
        permisos?: number[];
    }): Promise<{
        permisoIds: number[];
        ID_Rol?: number | undefined;
        Nombre?: string | undefined;
        Descripcion?: string | undefined;
        rolPermisos?: RolPermiso[] | undefined;
        deleted_at?: Date | undefined;
    }>;
    getRolWithPermisos(id: number): Promise<{
        permisoIds: number[];
        ID_Rol?: number | undefined;
        Nombre?: string | undefined;
        Descripcion?: string | undefined;
        rolPermisos?: RolPermiso[] | undefined;
        deleted_at?: Date | undefined;
    }>;
    deleteRol(id: number, requestingUserRoles?: string[]): Promise<{
        success: boolean;
    }>;
    getAllUsuarios(): Promise<Usuario[]>;
    unlockUsuario(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateUsuarioEstado(id: number, estado: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllPermisos(): Promise<Permiso[]>;
    updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateSelfProfile(userId: number, dto: UpdateSelfProfileDto): Promise<{
        success: boolean;
        message: string;
        updatedUser: {
            id: number;
            username: string;
            email: string;
            fullName: string;
        };
    }>;
    syncUserPermisos(idUsuario: number, idRol: number, idPermisos: number[]): Promise<{
        success: boolean;
        message: string;
    }>;
}
