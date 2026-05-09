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
exports.LogisticsCatalogController = void 0;
const common_1 = require("@nestjs/common");
const logistics_catalog_service_1 = require("./logistics-catalog.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let LogisticsCatalogController = class LogisticsCatalogController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getProveedores() { return this.svc.getProveedores(); }
    createProveedor(dto) { return this.svc.createProveedor(dto); }
    updateProveedor(id, dto) {
        return this.svc.updateProveedor(id, dto);
    }
    removeProveedor(id) { return this.svc.removeProveedor(id); }
    getVehiculos() { return this.svc.getVehiculos(); }
    createVehiculo(dto) { return this.svc.createVehiculo(dto); }
    updateVehiculo(id, dto) {
        return this.svc.updateVehiculo(id, dto);
    }
    removeVehiculo(id) { return this.svc.removeVehiculo(id); }
    getRutas() { return this.svc.getRutas(); }
    createRuta(dto) { return this.svc.createRuta(dto); }
    updateRuta(id, dto) {
        return this.svc.updateRuta(id, dto);
    }
    removeRuta(id) { return this.svc.removeRuta(id); }
};
exports.LogisticsCatalogController = LogisticsCatalogController;
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_PROVEEDORES', 'MODULO_FINANZAS', 'MODULO_REPORTES'),
    (0, common_1.Get)('proveedores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "getProveedores", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_PROVEEDORES'),
    (0, common_1.Post)('proveedores'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "createProveedor", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_PROVEEDORES'),
    (0, common_1.Put)('proveedores/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "updateProveedor", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_PROVEEDORES'),
    (0, common_1.Delete)('proveedores/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "removeProveedor", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_TERMINAL', 'MODULO_DESPACHOS'),
    (0, common_1.Get)('vehiculos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "getVehiculos", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_TERMINAL'),
    (0, common_1.Post)('vehiculos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "createVehiculo", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_TERMINAL'),
    (0, common_1.Put)('vehiculos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "updateVehiculo", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_TERMINAL'),
    (0, common_1.Delete)('vehiculos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "removeVehiculo", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS'),
    (0, common_1.Get)('rutas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "getRutas", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS'),
    (0, common_1.Post)('rutas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "createRuta", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS'),
    (0, common_1.Put)('rutas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "updateRuta", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS'),
    (0, common_1.Delete)('rutas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogisticsCatalogController.prototype, "removeRuta", null);
exports.LogisticsCatalogController = LogisticsCatalogController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('logistics-catalog'),
    __metadata("design:paramtypes", [logistics_catalog_service_1.LogisticsCatalogService])
], LogisticsCatalogController);
//# sourceMappingURL=logistics-catalog.controller.js.map