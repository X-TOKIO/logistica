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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleCompra = void 0;
const typeorm_1 = require("typeorm");
const nota_compra_entity_1 = require("./nota-compra.entity");
const producto_entity_1 = require("../../warehouse/entities/producto.entity");
let DetalleCompra = class DetalleCompra {
    ID_Detalle;
    Cantidad;
    Precio_Unitario;
    Subtotal;
    Fecha_Elaboracion;
    Fecha_Vencimiento;
    ID_Compra;
    ID_Producto;
    notaCompra;
    producto;
};
exports.DetalleCompra = DetalleCompra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Detalle' }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "ID_Detalle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cantidad', type: 'int' }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "Cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Precio_Unitario', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "Precio_Unitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Subtotal', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "Subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Elaboracion', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DetalleCompra.prototype, "Fecha_Elaboracion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Vencimiento', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DetalleCompra.prototype, "Fecha_Vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Compra' }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "ID_Compra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Producto' }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "ID_Producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nota_compra_entity_1.NotaCompra, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Compra' }),
    __metadata("design:type", nota_compra_entity_1.NotaCompra)
], DetalleCompra.prototype, "notaCompra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleCompra.prototype, "producto", void 0);
exports.DetalleCompra = DetalleCompra = __decorate([
    (0, typeorm_1.Entity)('DetalleCompra')
], DetalleCompra);
//# sourceMappingURL=detalle-compra.entity.js.map