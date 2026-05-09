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
exports.NotaCompra = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
const proveedor_entity_1 = require("./proveedor.entity");
const detalle_compra_entity_1 = require("./detalle-compra.entity");
const almacen_entity_1 = require("../../warehouse/entities/almacen.entity");
let NotaCompra = class NotaCompra {
    ID_Compra;
    Fecha_Emision;
    Hora_Emision;
    ID_Almacen;
    almacen;
    Costo_Envio;
    Monto_Total;
    Estado_Documento;
    Condicion_Pago;
    Nro_Factura;
    Ref_Libelula;
    Id_Libelula;
    Codigo_Recaudacion;
    Refs_Previas;
    Qr_Url;
    ID_Proveedor;
    ID_Empleado;
    proveedor;
    empleado;
    detalles;
    deleted_at;
};
exports.NotaCompra = NotaCompra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Compra' }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "ID_Compra", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], NotaCompra.prototype, "Fecha_Emision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Hora_Emision', type: 'time', nullable: true }),
    __metadata("design:type", String)
], NotaCompra.prototype, "Hora_Emision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Almacen', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => almacen_entity_1.Almacen, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", almacen_entity_1.Almacen)
], NotaCompra.prototype, "almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Costo_Envio', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "Costo_Envio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Monto_Total', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "Monto_Total", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado_Documento', length: 20, default: 'ACTIVO' }),
    __metadata("design:type", String)
], NotaCompra.prototype, "Estado_Documento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Condicion_Pago', length: 20, default: 'CONTADO' }),
    __metadata("design:type", String)
], NotaCompra.prototype, "Condicion_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], NotaCompra.prototype, "Nro_Factura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Ref_Libelula', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], NotaCompra.prototype, "Ref_Libelula", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Id_Libelula', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], NotaCompra.prototype, "Id_Libelula", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Codigo_Recaudacion', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], NotaCompra.prototype, "Codigo_Recaudacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Refs_Previas', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], NotaCompra.prototype, "Refs_Previas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Qr_Url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], NotaCompra.prototype, "Qr_Url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Proveedor' }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "ID_Proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], NotaCompra.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Proveedor' }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], NotaCompra.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], NotaCompra.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_compra_entity_1.DetalleCompra, d => d.notaCompra),
    __metadata("design:type", Array)
], NotaCompra.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], NotaCompra.prototype, "deleted_at", void 0);
exports.NotaCompra = NotaCompra = __decorate([
    (0, typeorm_1.Entity)('NotaCompra')
], NotaCompra);
//# sourceMappingURL=nota-compra.entity.js.map