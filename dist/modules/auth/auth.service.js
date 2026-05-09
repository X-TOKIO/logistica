"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("./entities/usuario.entity");
const rol_permiso_usuario_entity_1 = require("./entities/rol-permiso-usuario.entity");
const empleado_entity_1 = require("./entities/empleado.entity");
const rol_entity_1 = require("./entities/rol.entity");
const permiso_entity_1 = require("./entities/permiso.entity");
const rol_permiso_entity_1 = require("./entities/rol-permiso.entity");
let AuthService = AuthService_1 = class AuthService {
    usuarioRepo;
    empleadoRepo;
    rolPermisoUsuarioRepo;
    rolRepo;
    perRepo;
    rolPerRepo;
    jwtService;
    dataSource;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usuarioRepo, empleadoRepo, rolPermisoUsuarioRepo, rolRepo, perRepo, rolPerRepo, jwtService, dataSource) {
        this.usuarioRepo = usuarioRepo;
        this.empleadoRepo = empleadoRepo;
        this.rolPermisoUsuarioRepo = rolPermisoUsuarioRepo;
        this.rolRepo = rolRepo;
        this.perRepo = perRepo;
        this.rolPerRepo = rolPerRepo;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        await this.seedInicial();
    }
    async seedInicial() {
        this.logger.log('Iniciando verificación/inserción de Seed...');
        const exists = await this.rolRepo.findOne({ where: { Nombre: 'ADMINISTRADOR' } });
        if (!exists)
            await this.rolRepo.save({ Nombre: 'ADMINISTRADOR', Descripcion: 'Rol maestro del sistema' });
        const modulosPermisos = [
            { nombre: 'MODULO_CATALOGO', desc: 'Acceso al módulo de Catálogo (Categorías, Medidas, Productos)' },
            { nombre: 'MODULO_ALMACEN', desc: 'Acceso al módulo de Almacenes y Sucursales' },
            { nombre: 'MODULO_INVENTARIO', desc: 'Acceso al módulo de Inventario (Ingresos, Egresos, Mermas)' },
            { nombre: 'MODULO_DESPACHOS', desc: 'Acceso al módulo de Despachos y Monitor Satelital' },
            { nombre: 'MODULO_TERMINAL', desc: 'Acceso al módulo de Terminal Vehicular' },
            { nombre: 'MODULO_PROVEEDORES', desc: 'Acceso al módulo de Gestión de Proveedores' },
            { nombre: 'MODULO_FINANZAS', desc: 'Acceso al módulo de Finanzas (Compras, Cuentas por Pagar)' },
            { nombre: 'MODULO_REPORTES', desc: 'Acceso al módulo de Reportes e Inteligencia de Negocios' },
            { nombre: 'MODULO_RRHH', desc: 'Acceso al módulo de Recursos Humanos' },
            { nombre: 'MODULO_USUARIOS', desc: 'Acceso al módulo de Gestión de Usuarios' },
            { nombre: 'MODULO_SEGURIDAD', desc: 'Acceso al módulo de Seguridad y Roles' },
        ];
        for (const { nombre, desc } of modulosPermisos) {
            const exists = await this.perRepo.findOne({ where: { Nombre: nombre } });
            if (!exists)
                await this.perRepo.save({ Nombre: nombre, Descripcion: desc });
        }
        const typos = [
            { wrong: 'MODULO_DEESPACHOS', correct: 'MODULO_DESPACHOS' },
        ];
        for (const { wrong, correct } of typos) {
            const wrongPerm = await this.perRepo.findOne({ where: { Nombre: wrong } });
            if (!wrongPerm)
                continue;
            const correctPerm = await this.perRepo.findOne({ where: { Nombre: correct } });
            if (correctPerm) {
                const wrongAssignments = await this.rolPermisoUsuarioRepo.find({ where: { ID_Permiso: wrongPerm.ID_Permiso } });
                for (const wa of wrongAssignments) {
                    const alreadyCorrect = await this.rolPermisoUsuarioRepo.findOne({
                        where: { ID_Usuario: wa.ID_Usuario, ID_Rol: wa.ID_Rol, ID_Permiso: correctPerm.ID_Permiso },
                    });
                    if (!alreadyCorrect) {
                        await this.rolPermisoUsuarioRepo.save({
                            ID_Usuario: wa.ID_Usuario,
                            ID_Rol: wa.ID_Rol,
                            ID_Permiso: correctPerm.ID_Permiso,
                            fecha_asignacion: wa.fecha_asignacion,
                        });
                    }
                }
                await this.rolPermisoUsuarioRepo.delete({ ID_Permiso: wrongPerm.ID_Permiso });
                await this.rolPerRepo.delete({ ID_Permiso: wrongPerm.ID_Permiso });
                await this.perRepo.delete(wrongPerm.ID_Permiso);
            }
            else {
                await this.perRepo.update(wrongPerm.ID_Permiso, { Nombre: correct });
            }
            this.logger.warn(`[FIX-TYPO] Permiso "${wrong}" corregido a "${correct}" en DB.`);
        }
        const legacy = await this.perRepo
            .createQueryBuilder('p')
            .where("p.\"Nombre\" NOT LIKE 'MODULO_%'")
            .andWhere('p.deleted_at IS NULL')
            .getMany();
        for (const p of legacy) {
            await this.rolPermisoUsuarioRepo.delete({ ID_Permiso: p.ID_Permiso });
            await this.rolPerRepo.delete({ ID_Permiso: p.ID_Permiso });
            await this.perRepo.softDelete(p.ID_Permiso);
            this.logger.warn(`Permiso formato antiguo eliminado: "${p.Nombre}"`);
        }
        const rolAdmin = await this.rolRepo.findOne({ where: { Nombre: 'ADMINISTRADOR' } });
        if (rolAdmin) {
            const todosPermisos = await this.perRepo.find();
            for (const permiso of todosPermisos) {
                const rpExists = await this.rolPerRepo.findOne({
                    where: { ID_Rol: rolAdmin.ID_Rol, ID_Permiso: permiso.ID_Permiso },
                });
                if (!rpExists) {
                    await this.rolPerRepo.save({ ID_Rol: rolAdmin.ID_Rol, ID_Permiso: permiso.ID_Permiso });
                }
            }
        }
        let empAnonimo = await this.empleadoRepo.findOne({ where: { CI: 'ANONIMO' } });
        if (!empAnonimo) {
            empAnonimo = await this.empleadoRepo.save({
                Nombre: 'Sistema', Paterno: 'Anónimo', CI: 'ANONIMO', FechaContratacion: new Date(),
            });
        }
        const usuAnonimo = await this.usuarioRepo.findOne({ where: { UserName: 'anonimo' } });
        if (!usuAnonimo) {
            await this.usuarioRepo.save({
                UserName: 'anonimo', Email: 'anon@paradiso.com', Password: 'x', Estado: 'SISTEMA', ID_Empleado: empAnonimo.ID_Empleado,
            });
        }
        let empAdmin = await this.empleadoRepo.findOne({ where: { CI: 'ADMIN01' } });
        if (!empAdmin) {
            empAdmin = await this.empleadoRepo.save({
                Nombre: 'Gerencia', Paterno: 'General', CI: 'ADMIN01', FechaContratacion: new Date(),
            });
        }
        let usuAdmin = await this.usuarioRepo.findOne({ where: { UserName: 'admin' } });
        if (!usuAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('Admin123*', salt);
            usuAdmin = await this.usuarioRepo.save({
                UserName: 'admin', Email: 'admin@paradiso.com', Password: hash, Estado: 'ACTIVO', ID_Empleado: empAdmin.ID_Empleado,
            });
            this.logger.log('=> Usuario Administrador base de datos creado exitosamente: admin / Admin123*');
        }
        if (rolAdmin && usuAdmin) {
            const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: rolAdmin.ID_Rol } });
            for (const rp of rolPermisos) {
                const rpuExists = await this.rolPermisoUsuarioRepo.findOne({
                    where: { ID_Usuario: usuAdmin.ID_Usuario, ID_Rol: rolAdmin.ID_Rol, ID_Permiso: rp.ID_Permiso },
                });
                if (!rpuExists) {
                    await this.rolPermisoUsuarioRepo.save({
                        ID_Usuario: usuAdmin.ID_Usuario,
                        ID_Rol: rolAdmin.ID_Rol,
                        ID_Permiso: rp.ID_Permiso,
                        fecha_asignacion: new Date(),
                    });
                }
            }
        }
        this.logger.log('Verificación completada: Los datos fundamentales de RBAC y auditoría existen.');
    }
    async createEmpleado(dto) {
        const exist = await this.empleadoRepo.findOne({ where: { CI: dto.CI } });
        if (exist)
            throw new common_1.ForbiddenException('CI Empleado ya existe');
        const nuevo = this.empleadoRepo.create({
            Nombre: dto.Nombre,
            Materno: dto.Materno,
            Paterno: dto.Paterno,
            CI: dto.CI,
            Telefono: dto.Telefono,
            Direccion: dto.Direccion,
            Cargo: dto.Cargo,
            FechaContratacion: new Date(dto.FechaContratacion),
        });
        return await this.empleadoRepo.save(nuevo);
    }
    async getEmpleados() {
        return await this.empleadoRepo.find({ order: { FechaContratacion: 'DESC' } });
    }
    async updateEmpleado(id, dto) {
        const emp = await this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
        if (!emp)
            throw new common_1.ForbiddenException('Empleado no encontrado');
        await this.empleadoRepo.update(id, {
            Nombre: dto.Nombre ?? emp.Nombre,
            Materno: dto.Materno ?? emp.Materno,
            Paterno: dto.Paterno ?? emp.Paterno,
            CI: dto.CI ?? emp.CI,
            Telefono: dto.Telefono ?? emp.Telefono,
            Direccion: dto.Direccion ?? emp.Direccion,
            Cargo: dto.Cargo ?? emp.Cargo,
            FechaContratacion: dto.FechaContratacion ? new Date(dto.FechaContratacion) : emp.FechaContratacion,
        });
        return this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
    }
    async deleteEmpleado(id) {
        const emp = await this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
        if (!emp)
            throw new common_1.ForbiddenException('Empleado no encontrado');
        await this.empleadoRepo.softDelete(id);
        return { success: true };
    }
    async register(dto) {
        const empleado = await this.empleadoRepo.findOne({ where: { ID_Empleado: dto.ID_Empleado } });
        if (!empleado)
            throw new common_1.ForbiddenException('ID_Empleado inválido');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.Password, salt);
        const newUser = this.usuarioRepo.create({
            UserName: dto.UserName, Email: dto.Email, Password: hashedPassword, Estado: 'ACTIVO',
            ID_Empleado: dto.ID_Empleado, ID_Rol: dto.ID_Rol ?? null,
        });
        const savedUser = await this.usuarioRepo.save(newUser);
        if (dto.ID_Rol) {
            const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: dto.ID_Rol } });
            if (rolPermisos.length > 0) {
                const asignaciones = rolPermisos.map(rp => this.rolPermisoUsuarioRepo.create({
                    ID_Usuario: savedUser.ID_Usuario,
                    ID_Rol: rp.ID_Rol,
                    ID_Permiso: rp.ID_Permiso,
                    fecha_asignacion: new Date(),
                }));
                await this.rolPermisoUsuarioRepo.save(asignaciones);
            }
        }
        return savedUser;
    }
    async getRolesYPermisos(userId) {
        const usuario = await this.usuarioRepo.findOne({
            where: { ID_Usuario: userId },
            relations: ['asignaciones'],
        });
        if (!usuario?.asignaciones?.length)
            return { roles: [], permisos: [] };
        const roleIds = [...new Set(usuario.asignaciones.map(a => a.ID_Rol))];
        const permIds = [...new Set(usuario.asignaciones.map(a => a.ID_Permiso))];
        const [rolesEntities, permisosEntities] = await Promise.all([
            roleIds.length > 0 ? this.rolRepo.find({ where: { ID_Rol: (0, typeorm_2.In)(roleIds) } }) : [],
            permIds.length > 0 ? this.perRepo.find({ where: { ID_Permiso: (0, typeorm_2.In)(permIds) } }) : [],
        ]);
        const roles = rolesEntities.map(r => String(r.Nombre)).filter(Boolean);
        const permisos = permisosEntities.map(p => String(p.Nombre)).filter(Boolean);
        this.logger.log(`[RBAC] userId=${userId} → roles=[${roles.join(',')}] permisos=[${permisos.join(',')}]`);
        return { roles, permisos };
    }
    async login(dto) {
        const user = await this.usuarioRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.empleado', 'empleado')
            .where('user.UserName = :username', { username: dto.UserName })
            .addSelect('user.Password')
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (user.Estado === 'BLOQUEADO_PERMANENTE') {
            throw new common_1.ForbiddenException('Cuenta bloqueada permanentemente. Contacte a un administrador.');
        }
        if (user.Estado === 'BLOQUEADO' && user.bloqueadoHasta) {
            if (new Date() < user.bloqueadoHasta) {
                let minutos = Math.ceil((user.bloqueadoHasta.getTime() - new Date().getTime()) / 60000);
                throw new common_1.ForbiddenException(`Cuenta temporalmente bloqueada por múltiples intentos. Restan ${minutos} min.`);
            }
            else {
                user.Estado = 'ACTIVO';
                user.bloqueadoHasta = null;
            }
        }
        const isMatch = await bcrypt.compare(dto.Password, user.Password);
        if (!isMatch) {
            user.intentosFallidos += 1;
            if (user.intentosFallidos >= 10)
                user.Estado = 'BLOQUEADO_PERMANENTE';
            else if (user.intentosFallidos % 3 === 0) {
                user.Estado = 'BLOQUEADO';
                user.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000);
            }
            await this.usuarioRepo.save(user);
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        user.intentosFallidos = 0;
        user.bloqueadoHasta = null;
        user.Estado = 'ACTIVO';
        user.ultimoLogin = new Date();
        await this.usuarioRepo.save(user);
        const { roles: userRoles, permisos: userPermisos } = await this.getRolesYPermisos(user.ID_Usuario);
        const fullName = user.empleado
            ? [user.empleado.Nombre, user.empleado.Paterno].filter(Boolean).join(' ')
            : user.UserName;
        return {
            access_token: this.jwtService.sign({ sub: user.ID_Usuario, username: user.UserName, roles: userRoles, permissions: userPermisos }),
            user: { id: user.ID_Usuario, username: user.UserName, email: user.Email, fullName, roles: userRoles, permissions: userPermisos }
        };
    }
    async refreshToken(userId) {
        const user = await this.usuarioRepo.findOne({
            where: { ID_Usuario: userId },
            relations: ['empleado'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no válido');
        const { roles: userRoles, permisos: userPermisos } = await this.getRolesYPermisos(user.ID_Usuario);
        const fullName = user.empleado
            ? [user.empleado.Nombre, user.empleado.Paterno].filter(Boolean).join(' ')
            : user.UserName;
        return {
            access_token: this.jwtService.sign({ sub: user.ID_Usuario, username: user.UserName, roles: userRoles, permissions: userPermisos }),
            user: { id: user.ID_Usuario, username: user.UserName, email: user.Email, fullName, roles: userRoles, permissions: userPermisos }
        };
    }
    async getAllUsers() {
        return this.usuarioRepo.find({ relations: ['empleado'] });
    }
    async getMatrix() {
        const roles = await this.rolRepo.find();
        const permisos = await this.perRepo.find();
        return { roles, permisos };
    }
    async getUserMatrix(userId) {
        return this.rolPermisoUsuarioRepo.find({ where: { ID_Usuario: userId }, relations: ['rolPermiso', 'rolPermiso.rol', 'rolPermiso.permiso'] });
    }
    async assignRoleAccess(idUsuario, idRol, idPermiso) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario inexistente.');
        let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
        if (!rp)
            rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });
        const exists = await this.rolPermisoUsuarioRepo.findOne({ where: { ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso } });
        if (exists)
            throw new common_1.UnauthorizedException('El empleado ya tiene asignado estre rol con este permiso.');
        const nuevaAsignacion = this.rolPermisoUsuarioRepo.create({
            ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso, fecha_asignacion: new Date()
        });
        return await this.rolPermisoUsuarioRepo.save(nuevaAsignacion);
    }
    async assignMultipleAccess(idUsuario, idRol, idPermisos) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario inexistente.');
        for (const idPermiso of idPermisos) {
            let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
            if (!rp) {
                rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });
            }
            const exists = await this.rolPermisoUsuarioRepo.findOne({ where: { ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso } });
            if (!exists) {
                const nuevaAsignacion = this.rolPermisoUsuarioRepo.create({
                    ID_Usuario: idUsuario,
                    ID_Rol: idRol,
                    ID_Permiso: idPermiso,
                    fecha_asignacion: new Date()
                });
                await this.rolPermisoUsuarioRepo.save(nuevaAsignacion);
            }
        }
        return { success: true, message: 'Asignaciones creadas' };
    }
    async revokeAccess(idUsuario, idRol, idPermiso) {
        const rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
        if (rp) {
            await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso });
        }
        return { success: true, message: 'Revocado localmente' };
    }
    async getAllRoles() {
        const roles = await this.rolRepo.find({ order: { Nombre: 'ASC' } });
        return await Promise.all(roles.map(async (rol) => {
            const rps = await this.rolPerRepo.find({
                where: { ID_Rol: rol.ID_Rol },
                relations: ['permiso']
            });
            return {
                ...rol,
                permisos: rps.map(rp => rp.permiso),
                permisoIds: rps.map(rp => rp.ID_Permiso)
            };
        }));
    }
    async getRolById(id) {
        return this.rolRepo.findOne({ where: { ID_Rol: id } });
    }
    async createRol(data) {
        const existing = await this.rolRepo.findOne({ where: { Nombre: data.nombre } });
        if (existing)
            throw new common_1.ForbiddenException('Nombre de Rol ya existe');
        const rol = await this.rolRepo.save({
            Nombre: data.nombre.toUpperCase().trim(),
            Descripcion: data.descripcion || ''
        });
        if (data.permisos && data.permisos.length > 0) {
            const nuevosPermisos = data.permisos.map(idPermiso => ({
                ID_Rol: rol.ID_Rol,
                ID_Permiso: idPermiso
            }));
            await this.rolPerRepo.save(nuevosPermisos);
        }
        return rol;
    }
    async updateRol(id, data) {
        const existing = await this.rolRepo.findOne({ where: { ID_Rol: id } });
        if (existing?.Nombre === 'ADMINISTRADOR') {
            throw new common_1.BadRequestException('Acción denegada: No se puede modificar el rol maestro del sistema.');
        }
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            await qr.manager.update(rol_entity_1.Rol, id, {
                Nombre: data.nombre.toUpperCase().trim(),
                Descripcion: data.descripcion ?? undefined,
            });
            if (data.permisos !== undefined) {
                const raw = await qr.manager
                    .createQueryBuilder(rol_permiso_usuario_entity_1.RolPermisoUsuario, 'rpu')
                    .select('DISTINCT rpu."ID_Usuario"', 'uid')
                    .where('rpu."ID_Rol" = :id', { id })
                    .getRawMany();
                const fromDirectAssignment = await qr.manager.find(usuario_entity_1.Usuario, { where: { ID_Rol: id } });
                const usuariosConRol = [
                    ...new Set([...raw.map(r => r.uid), ...fromDirectAssignment.map(u => u.ID_Usuario)])
                ];
                await qr.manager.createQueryBuilder().delete().from(rol_permiso_usuario_entity_1.RolPermisoUsuario).where('"ID_Rol" = :id', { id }).execute();
                await qr.manager.createQueryBuilder().delete().from(rol_permiso_entity_1.RolPermiso).where('"ID_Rol" = :id', { id }).execute();
                const ids = data.permisos.map(Number).filter(n => !isNaN(n) && n > 0);
                if (ids.length > 0) {
                    await qr.manager.save(rol_permiso_entity_1.RolPermiso, ids.map(permId => ({ ID_Rol: id, ID_Permiso: permId })));
                    if (usuariosConRol.length > 0) {
                        const reasignaciones = usuariosConRol.flatMap(uid => ids.map(permId => ({
                            ID_Usuario: uid,
                            ID_Rol: id,
                            ID_Permiso: permId,
                            fecha_asignacion: new Date(),
                        })));
                        await qr.manager.save(rol_permiso_usuario_entity_1.RolPermisoUsuario, reasignaciones);
                    }
                }
            }
            await qr.commitTransaction();
            return this.getRolWithPermisos(id);
        }
        catch (error) {
            await qr.rollbackTransaction();
            this.logger.error('Error en updateRol (transaction rolled back):', error);
            throw new common_1.InternalServerErrorException('Fallo al sincronizar permisos del Rol en la DB');
        }
        finally {
            await qr.release();
        }
    }
    async getRolWithPermisos(id) {
        const rol = await this.rolRepo.findOne({ where: { ID_Rol: id } });
        const rps = await this.rolPerRepo.find({ where: { ID_Rol: id } });
        return { ...rol, permisoIds: rps.map(rp => rp.ID_Permiso) };
    }
    async deleteRol(id, requestingUserRoles = []) {
        const rol = await this.rolRepo.findOne({ where: { ID_Rol: id } });
        if (!rol)
            throw new common_1.BadRequestException('Rol no encontrado.');
        if (rol.Nombre === 'ADMINISTRADOR') {
            throw new common_1.BadRequestException('Acción denegada: No se puede eliminar ni modificar el rol maestro del sistema.');
        }
        if (requestingUserRoles.includes(rol.Nombre)) {
            throw new common_1.BadRequestException('Acción denegada: No puede eliminar un rol que tiene asignado actualmente.');
        }
        try {
            await this.rolPerRepo.delete({ ID_Rol: id });
            const result = await this.rolRepo.delete(id);
            if (result.affected === 0)
                throw new common_1.ForbiddenException('Rol no encontrado');
            return { success: true };
        }
        catch (error) {
            throw new common_1.ForbiddenException('No se puede eliminar: El rol está asignado a un empleado actualmente.');
        }
    }
    async getAllUsuarios() {
        return this.usuarioRepo.find({
            relations: ['empleado'],
            order: { ID_Usuario: 'ASC' },
        });
    }
    async unlockUsuario(id) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario no encontrado.');
        user.Estado = 'ACTIVO';
        user.intentosFallidos = 0;
        user.bloqueadoHasta = null;
        await this.usuarioRepo.save(user);
        return { success: true, message: `Usuario ${user.UserName} desbloqueado correctamente.` };
    }
    async updateUsuarioEstado(id, estado) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario no encontrado.');
        const estadosValidos = ['ACTIVO', 'INACTIVO', 'BLOQUEADO_PERMANENTE'];
        if (!estadosValidos.includes(estado))
            throw new common_1.ForbiddenException('Estado no válido.');
        user.Estado = estado;
        if (estado === 'ACTIVO') {
            user.intentosFallidos = 0;
            user.bloqueadoHasta = null;
        }
        await this.usuarioRepo.save(user);
        return { success: true, message: `Estado actualizado a ${estado}.` };
    }
    async getAllPermisos() {
        return this.perRepo.find({ order: { Nombre: 'ASC' } });
    }
    async updateUsuario(id, dto) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id }, relations: ['empleado'] });
        if (!user)
            throw new common_1.ForbiddenException('Usuario no encontrado.');
        if (user.Estado === 'SISTEMA')
            throw new common_1.ForbiddenException('No se puede modificar el usuario del sistema.');
        const userUpdates = {};
        if (dto.Email && dto.Email !== user.Email) {
            const emailExists = await this.usuarioRepo.findOne({ where: { Email: dto.Email } });
            if (emailExists)
                throw new common_1.ForbiddenException('El email ya está en uso por otro usuario.');
            userUpdates.Email = dto.Email;
        }
        if (dto.NewPassword) {
            const salt = await bcrypt.genSalt(10);
            userUpdates.Password = await bcrypt.hash(dto.NewPassword, salt);
        }
        if (Object.keys(userUpdates).length > 0) {
            await this.usuarioRepo.update(id, userUpdates);
        }
        if (user.empleado && (dto.Nombre || dto.Paterno)) {
            const empUpdates = {};
            if (dto.Nombre)
                empUpdates.Nombre = dto.Nombre;
            if (dto.Paterno)
                empUpdates.Paterno = dto.Paterno;
            await this.empleadoRepo.update(user.empleado.ID_Empleado, empUpdates);
        }
        if (dto.ID_Rol) {
            await this.usuarioRepo.update(id, { ID_Rol: dto.ID_Rol });
            const newRol = await this.rolRepo.findOne({ where: { ID_Rol: dto.ID_Rol } });
            if (newRol && user.empleado) {
                await this.empleadoRepo.update(user.empleado.ID_Empleado, { Cargo: newRol.Nombre });
            }
            await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: id });
            const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: dto.ID_Rol } });
            if (rolPermisos.length > 0) {
                const nuevas = rolPermisos.map(rp => this.rolPermisoUsuarioRepo.create({
                    ID_Usuario: id,
                    ID_Rol: dto.ID_Rol,
                    ID_Permiso: rp.ID_Permiso,
                    fecha_asignacion: new Date(),
                }));
                await this.rolPermisoUsuarioRepo.save(nuevas);
            }
        }
        return { success: true, message: `Usuario ${user.UserName} actualizado correctamente.` };
    }
    async updateSelfProfile(userId, dto) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: userId }, relations: ['empleado'] });
        if (!user)
            throw new common_1.ForbiddenException('Usuario no encontrado.');
        const userUpdates = {};
        if (dto.Email && dto.Email !== user.Email) {
            const emailExists = await this.usuarioRepo.findOne({ where: { Email: dto.Email } });
            if (emailExists)
                throw new common_1.ForbiddenException('El email ya está en uso.');
            userUpdates.Email = dto.Email;
        }
        if (dto.NewPassword) {
            const salt = await bcrypt.genSalt(10);
            userUpdates.Password = await bcrypt.hash(dto.NewPassword, salt);
        }
        if (Object.keys(userUpdates).length > 0) {
            await this.usuarioRepo.update(userId, userUpdates);
        }
        if (user.empleado && (dto.Nombre || dto.Paterno)) {
            const empUpdates = {};
            if (dto.Nombre)
                empUpdates.Nombre = dto.Nombre;
            if (dto.Paterno)
                empUpdates.Paterno = dto.Paterno;
            await this.empleadoRepo.update(user.empleado.ID_Empleado, empUpdates);
        }
        const updatedNombre = dto.Nombre ?? user.empleado?.Nombre ?? user.UserName;
        const updatedPaterno = dto.Paterno ?? user.empleado?.Paterno ?? '';
        const fullName = [updatedNombre, updatedPaterno].filter(Boolean).join(' ');
        return {
            success: true,
            message: 'Perfil actualizado correctamente.',
            updatedUser: {
                id: userId,
                username: user.UserName,
                email: dto.Email ?? user.Email,
                fullName,
            },
        };
    }
    async syncUserPermisos(idUsuario, idRol, idPermisos) {
        const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario inexistente.');
        await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: idUsuario, ID_Rol: idRol });
        for (const idPermiso of idPermisos) {
            let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
            if (!rp)
                rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });
            await this.rolPermisoUsuarioRepo.save({
                ID_Usuario: idUsuario,
                ID_Rol: idRol,
                ID_Permiso: idPermiso,
                fecha_asignacion: new Date()
            });
        }
        return { success: true, message: 'Permisos sincronizados' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __param(2, (0, typeorm_1.InjectRepository)(rol_permiso_usuario_entity_1.RolPermisoUsuario)),
    __param(3, (0, typeorm_1.InjectRepository)(rol_entity_1.Rol)),
    __param(4, (0, typeorm_1.InjectRepository)(permiso_entity_1.Permiso)),
    __param(5, (0, typeorm_1.InjectRepository)(rol_permiso_entity_1.RolPermiso)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map