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
exports.NotaIngreso = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
const nota_compra_entity_1 = require("../../payments/entities/nota-compra.entity");
const detalle_ingreso_entity_1 = require("./detalle-ingreso.entity");
let NotaIngreso = class NotaIngreso {
    ID_Ingreso;
    Fecha;
    Hora;
    Descripcion;
    Nombre;
    ID_Compra;
    ID_Empleado;
    compra;
    empleado;
    detalles;
    deleted_at;
};
exports.NotaIngreso = NotaIngreso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Ingreso' }),
    __metadata("design:type", Number)
], NotaIngreso.prototype, "ID_Ingreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha', type: 'date' }),
    __metadata("design:type", Date)
], NotaIngreso.prototype, "Fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Hora', type: 'time' }),
    __metadata("design:type", String)
], NotaIngreso.prototype, "Hora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Descripcion', length: 300, nullable: true }),
    __metadata("design:type", String)
], NotaIngreso.prototype, "Descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100, nullable: true }),
    __metadata("design:type", String)
], NotaIngreso.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Compra', nullable: true }),
    __metadata("design:type", Object)
], NotaIngreso.prototype, "ID_Compra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], NotaIngreso.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nota_compra_entity_1.NotaCompra, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Compra' }),
    __metadata("design:type", nota_compra_entity_1.NotaCompra)
], NotaIngreso.prototype, "compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], NotaIngreso.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_ingreso_entity_1.DetalleIngreso, (d) => d.notaIngreso),
    __metadata("design:type", Array)
], NotaIngreso.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], NotaIngreso.prototype, "deleted_at", void 0);
exports.NotaIngreso = NotaIngreso = __decorate([
    (0, typeorm_1.Entity)('NotaIngreso')
], NotaIngreso);
//# sourceMappingURL=nota-ingreso.entity.js.map