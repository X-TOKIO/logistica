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
exports.NotaEgreso = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
const detalle_egreso_entity_1 = require("./detalle-egreso.entity");
let NotaEgreso = class NotaEgreso {
    ID_Egreso;
    Fecha;
    Hora;
    Descripcion;
    MontoTotal;
    ID_Empleado;
    empleado;
    detalles;
    deleted_at;
};
exports.NotaEgreso = NotaEgreso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Egreso' }),
    __metadata("design:type", Number)
], NotaEgreso.prototype, "ID_Egreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha', type: 'date' }),
    __metadata("design:type", Date)
], NotaEgreso.prototype, "Fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Hora', type: 'time' }),
    __metadata("design:type", String)
], NotaEgreso.prototype, "Hora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Descripcion', length: 300, nullable: true }),
    __metadata("design:type", String)
], NotaEgreso.prototype, "Descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MontoTotal', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], NotaEgreso.prototype, "MontoTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], NotaEgreso.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], NotaEgreso.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_egreso_entity_1.DetalleEgreso, (d) => d.notaEgreso),
    __metadata("design:type", Array)
], NotaEgreso.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], NotaEgreso.prototype, "deleted_at", void 0);
exports.NotaEgreso = NotaEgreso = __decorate([
    (0, typeorm_1.Entity)('NotaEgreso')
], NotaEgreso);
//# sourceMappingURL=nota-egreso.entity.js.map