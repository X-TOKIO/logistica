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
exports.DetalleMerma = void 0;
const typeorm_1 = require("typeorm");
const mermas_entity_1 = require("./mermas.entity");
const producto_almacen_entity_1 = require("../../warehouse/entities/producto-almacen.entity");
const producto_entity_1 = require("../../warehouse/entities/producto.entity");
let DetalleMerma = class DetalleMerma {
    ID_Merma;
    ID_Producto;
    ID_Almacen;
    Cantidad;
    merma;
    productoAlmacen;
    producto;
    deleted_at;
};
exports.DetalleMerma = DetalleMerma;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Merma' }),
    __metadata("design:type", Number)
], DetalleMerma.prototype, "ID_Merma", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", Number)
], DetalleMerma.prototype, "ID_Producto", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", Number)
], DetalleMerma.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cantidad', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleMerma.prototype, "Cantidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mermas_entity_1.Mermas, (m) => m.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Merma' }),
    __metadata("design:type", mermas_entity_1.Mermas)
], DetalleMerma.prototype, "merma", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_almacen_entity_1.ProductoAlmacen),
    (0, typeorm_1.JoinColumn)([
        { name: 'ID_Producto', referencedColumnName: 'ID_Producto' },
        { name: 'ID_Almacen', referencedColumnName: 'ID_Almacen' },
    ]),
    __metadata("design:type", producto_almacen_entity_1.ProductoAlmacen)
], DetalleMerma.prototype, "productoAlmacen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleMerma.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], DetalleMerma.prototype, "deleted_at", void 0);
exports.DetalleMerma = DetalleMerma = __decorate([
    (0, typeorm_1.Entity)('DetalleMerma')
], DetalleMerma);
//# sourceMappingURL=detalle-merma.entity.js.map