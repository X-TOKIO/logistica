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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const create_ingreso_dto_1 = require("./dto/create-ingreso.dto");
const create_egreso_dto_1 = require("./dto/create-egreso.dto");
const create_merma_dto_1 = require("./dto/create-merma.dto");
let InventoryController = class InventoryController {
    invService;
    constructor(invService) {
        this.invService = invService;
    }
    getIngresos() { return this.invService.getIngresos(); }
    registrarIngreso(dto, req) {
        return this.invService.registrarIngreso(dto, req.user.userId);
    }
    getEgresos() { return this.invService.getEgresos(); }
    registrarEgreso(dto, req) {
        return this.invService.registrarEgreso(dto, req.user.userId);
    }
    getMermas() { return this.invService.getMermas(); }
    registrarMerma(dto, req) {
        return this.invService.registrarMerma(dto, req.user.userId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('ingresos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getIngresos", null);
__decorate([
    (0, common_1.Post)('ingresos'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingreso_dto_1.CreateIngresoDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "registrarIngreso", null);
__decorate([
    (0, common_1.Get)('egresos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getEgresos", null);
__decorate([
    (0, common_1.Post)('egresos'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_egreso_dto_1.CreateEgresoDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "registrarEgreso", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_INVENTARIO', 'MODULO_REPORTES'),
    (0, common_1.Get)('mermas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMermas", null);
__decorate([
    (0, common_1.Post)('mermas'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_merma_dto_1.CreateMermaDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "registrarMerma", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_INVENTARIO'),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map