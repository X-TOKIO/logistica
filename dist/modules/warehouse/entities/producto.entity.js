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
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const u_medida_entity_1 = require("./u-medida.entity");
const categoria_entity_1 = require("./categoria.entity");
const producto_almacen_entity_1 = require("./producto-almacen.entity");
let Producto = class Producto {
    ID_Producto;
    CodigoBarra;
    Nombre;
    Descripcion;
    FechaVencimiento;
    Fecha_Elaboracion;
    Image;
    Ubicacion;
    PrecioUnitario;
    ID_Medida;
    ID_Categoria;
    medida;
    categoria;
    productoAlmacenes;
    deleted_at;
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Producto' }),
    __metadata("design:type", Number)
], Producto.prototype, "ID_Producto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CodigoBarra', length: 100, unique: true, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "CodigoBarra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100 }),
    __metadata("design:type", String)
], Producto.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Descripcion', length: 300, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "Descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaVencimiento', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Producto.prototype, "FechaVencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Elaboracion', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Producto.prototype, "Fecha_Elaboracion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Image', length: 300, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "Image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Ubicacion', length: 100, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "Ubicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PrecioUnitario', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "PrecioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Medida' }),
    __metadata("design:type", Number)
], Producto.prototype, "ID_Medida", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Categoria' }),
    __metadata("design:type", Number)
], Producto.prototype, "ID_Categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => u_medida_entity_1.UMedida),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Medida' }),
    __metadata("design:type", u_medida_entity_1.UMedida)
], Producto.prototype, "medida", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Categoria' }),
    __metadata("design:type", categoria_entity_1.Categoria)
], Producto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => producto_almacen_entity_1.ProductoAlmacen, pa => pa.producto),
    __metadata("design:type", Array)
], Producto.prototype, "productoAlmacenes", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Producto.prototype, "deleted_at", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)('Producto')
], Producto);
//# sourceMappingURL=producto.entity.js.map