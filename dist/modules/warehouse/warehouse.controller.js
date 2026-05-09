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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const warehouse_service_1 = require("./warehouse.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let WarehouseController = class WarehouseController {
    whService;
    constructor(whService) {
        this.whService = whService;
    }
    getCategorias() { return this.whService.getCategorias(); }
    createCategoria(dto) { return this.whService.createCategoria(dto); }
    updateCategoria(id, dto) { return this.whService.updateCategoria(id, dto); }
    deleteCategoria(id) { return this.whService.deleteCategoria(id); }
    getMedidas() { return this.whService.getMedidas(); }
    createMedida(dto) { return this.whService.createMedida(dto); }
    updateMedida(id, dto) { return this.whService.updateMedida(id, dto); }
    deleteMedida(id) { return this.whService.deleteMedida(id); }
    getAlmacenes() { return this.whService.getAlmacenes(); }
    createAlmacen(dto) { return this.whService.createAlmacen(dto); }
    updateAlmacen(id, dto) { return this.whService.updateAlmacen(id, dto); }
    deleteAlmacen(id) { return this.whService.deleteAlmacen(id); }
    getSucursales() { return this.whService.getSucursales(); }
    createSucursal(dto) { return this.whService.createSucursal(dto); }
    updateSucursal(id, dto) { return this.whService.updateSucursal(id, dto); }
    deleteSucursal(id) { return this.whService.deleteSucursal(id); }
    uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo.');
        return { url: `/uploads/products/${file.filename}` };
    }
    async exportPdf(search, categoria, almacen, req, res) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=catalogo-productos.pdf',
        });
        const buffer = await this.whService.exportProductosPdf(search, categoria ? +categoria : undefined, almacen ? +almacen : undefined, req?.user?.username);
        return new common_1.StreamableFile(buffer);
    }
    getProductos(search, categoria, almacen) {
        return this.whService.getProductos(search, categoria ? +categoria : undefined, almacen ? +almacen : undefined);
    }
    getProductoById(id) { return this.whService.getProductoById(id); }
    createProducto(dto) { return this.whService.createProducto(dto); }
    updateProducto(id, dto) { return this.whService.updateProducto(id, dto); }
    deleteProducto(id) { return this.whService.deleteProducto(id); }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Get)('categorias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getCategorias", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Post)('categorias'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "createCategoria", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Put)('categorias/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "updateCategoria", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Delete)('categorias/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "deleteCategoria", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Get)('medidas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getMedidas", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Post)('medidas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "createMedida", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Put)('medidas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "updateMedida", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Delete)('medidas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "deleteMedida", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN', 'MODULO_CATALOGO', 'MODULO_INVENTARIO', 'MODULO_DESPACHOS', 'MODULO_FINANZAS', 'MODULO_TERMINAL', 'MODULO_REPORTES'),
    (0, common_1.Get)('almacenes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getAlmacenes", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Post)('almacenes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "createAlmacen", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Put)('almacenes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "updateAlmacen", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Delete)('almacenes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "deleteAlmacen", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN', 'MODULO_DESPACHOS', 'MODULO_TERMINAL', 'MODULO_INVENTARIO', 'MODULO_REPORTES'),
    (0, common_1.Get)('sucursales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getSucursales", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Post)('sucursales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "createSucursal", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Put)('sucursales/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "updateSucursal", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_ALMACEN'),
    (0, common_1.Delete)('sucursales/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "deleteSucursal", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = './uploads/products';
                (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `prod-${suffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (/\.(jpg|jpeg|png|webp)$/i.test(file.originalname)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Solo se permiten imágenes jpg, png o webp'), false);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "uploadImage", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES'),
    (0, common_1.Get)('productos/export-pdf'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('categoria')),
    __param(2, (0, common_1.Query)('almacen')),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "exportPdf", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES'),
    (0, common_1.Get)('productos'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('categoria')),
    __param(2, (0, common_1.Query)('almacen')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getProductos", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES'),
    (0, common_1.Get)('productos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getProductoById", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Post)('productos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "createProducto", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Put)('productos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "updateProducto", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_CATALOGO'),
    (0, common_1.Delete)('productos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "deleteProducto", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('warehouse'),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map