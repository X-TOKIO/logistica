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
exports.DetalleEgreso = void 0;
const typeorm_1 = require("typeorm");
const nota_egreso_entity_1 = require("./nota-egreso.entity");
const producto_almacen_entity_1 = require("../../warehouse/entities/producto-almacen.entity");
const producto_entity_1 = require("../../warehouse/entities/producto.entity");
const sucursal_entity_1 = require("../../warehouse/entities/sucursal.entity");
let DetalleEgreso = class DetalleEgreso {
    ID_Egreso;
    ID_Producto;
    ID_Almacen;
    Cantidad;
    ID_Sucursal;
    notaEgreso;
    productoAlmacen;
    producto;
    sucursal;
    deleted_at;
};
exports.DetalleEgreso = DetalleEgreso;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Egreso' }),
    __metadata("design:type", Number)
], DetalleEgreso.prototype, "ID_Egreso", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", Number)
], DetalleEgreso.prototype, "ID_Producto", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", Number)
], DetalleEgreso.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cantidad', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleEgreso.prototype, "Cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Sucursal', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleEgreso.prototype, "ID_Sucursal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nota_egreso_entity_1.NotaEgreso, (n) => n.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Egreso' }),
    __metadata("design:type", nota_egreso_entity_1.NotaEgreso)
], DetalleEgreso.prototype, "notaEgreso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_almacen_entity_1.ProductoAlmacen),
    (0, typeorm_1.JoinColumn)([
        { name: 'ID_Producto', referencedColumnName: 'ID_Producto' },
        { name: 'ID_Almacen', referencedColumnName: 'ID_Almacen' },
    ]),
    __metadata("design:type", producto_almacen_entity_1.ProductoAlmacen)
], DetalleEgreso.prototype, "productoAlmacen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleEgreso.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sucursal_entity_1.Sucursal),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Sucursal' }),
    __metadata("design:type", sucursal_entity_1.Sucursal)
], DetalleEgreso.prototype, "sucursal", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], DetalleEgreso.prototype, "deleted_at", void 0);
exports.DetalleEgreso = DetalleEgreso = __decorate([
    (0, typeorm_1.Entity)('DetalleEgreso')
], DetalleEgreso);
//# sourceMappingURL=detalle-egreso.entity.js.map