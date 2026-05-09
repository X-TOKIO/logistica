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
exports.LogisticsController = void 0;
const common_1 = require("@nestjs/common");
const logistics_service_1 = require("./logistics.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let LogisticsController = class LogisticsController {
    srv;
    constructor(srv) {
        this.srv = srv;
    }
    getPendientes() { return this.srv.getPendientes(); }
    async getAuxiliares() {
        return { rutas: await this.srv.getRutas(), camiones: await this.srv.getCamiones() };
    }
    createDespacho(dto) { return this.srv.createDespacho(dto); }
    getActivos(req) {
        return this.srv.getDespachosActivos(req.user.userId, req.user.roles);
    }
    addTracking(dto) { return this.srv.addTracking(dto); }
    getHistorial(req) {
        return this.srv.getHistorial(req.user.userId, req.user.roles);
    }
    getLatestTracking() { return this.srv.getLatestTracking(); }
    updateDespachoProgreso(id, body) { return this.srv.updateDespachoProgreso(id, body.progreso, body.estado); }
    updateVehicleEstado(id, estado) { return this.srv.updateVehicleEstado(id, estado); }
};
exports.LogisticsController = LogisticsController;
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "getPendientes", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Get)('auxiliares'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogisticsController.prototype, "getAuxiliares", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS'),
    (0, common_1.Post)('despacho'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "createDespacho", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Get)('activos'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "getActivos", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Post)('tracking'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "addTracking", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL', 'MODULO_REPORTES'),
    (0, common_1.Get)('historial'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "getHistorial", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Get)('tracking-live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "getLatestTracking", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_DESPACHOS', 'MODULO_TERMINAL'),
    (0, common_1.Patch)('despacho/:id/progreso'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "updateDespachoProgreso", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_TERMINAL'),
    (0, common_1.Patch)('vehiculos/:id/estado'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "updateVehicleEstado", null);
exports.LogisticsController = LogisticsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [logistics_service_1.LogisticsService])
], LogisticsController);
//# sourceMappingURL=logistics.controller.js.map