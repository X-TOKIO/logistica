"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermisosController = exports.RolesController = exports.AccessController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let AccessController = class AccessController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    getUsers() {
        return this.authService.getAllUsers();
    }
    getMatrix() {
        return this.authService.getMatrix();
    }
    getUserMatrix(id) {
        return this.authService.getUserMatrix(Number(id));
    }
    assignRole(body) {
        if (!body.ID_Usuario || !body.ID_Rol || !body.ID_Permiso) {
            throw new Error('Faltan relaciones lógicas de la llave compuesta');
        }
        return this.authService.assignRoleAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permiso);
    }
    assignMultiple(body) {
        if (!body.ID_Usuario || !body.ID_Rol || !body.ID_Permisos?.length) {
            throw new Error('Faltan relaciones lógicas para asignación masiva');
        }
        return this.authService.assignMultipleAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permisos);
    }
    syncPermisos(body) {
        return this.authService.syncUserPermisos(body.ID_Usuario, body.ID_Rol, body.ID_Permisos);
    }
    revokeRole(body) {
        return this.authService.revokeAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permiso);
    }
};
exports.AccessController = AccessController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('matrix'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "getMatrix", null);
__decorate([
    (0, common_1.Get)('user-matrix/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "getUserMatrix", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Post)('assign-multiple'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "assignMultiple", null);
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "syncPermisos", null);
__decorate([
    (0, common_1.Post)('revoke'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "revokeRole", null);
exports.AccessController = AccessController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_USUARIOS', 'MODULO_SEGURIDAD'),
    (0, common_1.Controller)('access'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AccessController);
let RolesController = class RolesController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    getAll() {
        return this.authService.getAllRoles();
    }
    getOne(id) {
        return this.authService.getRolById(Number(id));
    }
    getWithPermisos(id) {
        return this.authService.getRolWithPermisos(Number(id));
    }
    create(body) {
        return this.authService.createRol(body);
    }
    update(id, body, req) {
        return this.authService.updateRol(Number(id), body);
    }
    remove(id, req) {
        const userRoles = req.user?.roles ?? [];
        return this.authService.deleteRol(Number(id), userRoles);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getAll", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getOne", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS'),
    (0, common_1.Get)(':id/permisos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getWithPermisos", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "remove", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD', 'MODULO_RRHH'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RolesController);
let PermisosController = class PermisosController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    getAll() {
        return this.authService.getAllPermisos();
    }
};
exports.PermisosController = PermisosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "getAll", null);
exports.PermisosController = PermisosController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS'),
    (0, common_1.Controller)('permisos'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], PermisosController);
//# sourceMappingURL=access.controller.js.map