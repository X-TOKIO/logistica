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
exports.ProductoAlmacen = void 0;
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("./producto.entity");
const almacen_entity_1 = require("./almacen.entity");
let ProductoAlmacen = class ProductoAlmacen {
    ID_Producto;
    ID_Almacen;
    Stock_Actual;
    producto;
    almacen;
    deleted_at;
};
exports.ProductoAlmacen = ProductoAlmacen;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", Number)
], ProductoAlmacen.prototype, "ID_Producto", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", Number)
], ProductoAlmacen.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Stock_Actual', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProductoAlmacen.prototype, "Stock_Actual", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", producto_entity_1.Producto)
], ProductoAlmacen.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => almacen_entity_1.Almacen),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", almacen_entity_1.Almacen)
], ProductoAlmacen.prototype, "almacen", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], ProductoAlmacen.prototype, "deleted_at", void 0);
exports.ProductoAlmacen = ProductoAlmacen = __decorate([
    (0, typeorm_1.Entity)('ProductoAlmacen')
], ProductoAlmacen);
//# sourceMappingURL=producto-almacen.entity.js.map