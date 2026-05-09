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
exports.Vehiculo = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
let Vehiculo = class Vehiculo {
    ID_Vehiculo;
    Placa;
    Marca;
    Modelo;
    Capacidad_Carga;
    Estado;
    ID_Empleado;
    empleado;
    deleted_at;
};
exports.Vehiculo = Vehiculo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Vehiculo' }),
    __metadata("design:type", Number)
], Vehiculo.prototype, "ID_Vehiculo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Placa', length: 20, unique: true }),
    __metadata("design:type", String)
], Vehiculo.prototype, "Placa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Marca', length: 100 }),
    __metadata("design:type", String)
], Vehiculo.prototype, "Marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Modelo', length: 100 }),
    __metadata("design:type", String)
], Vehiculo.prototype, "Modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Capacidad_Carga', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Vehiculo.prototype, "Capacidad_Carga", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 30, default: 'DISPONIBLE' }),
    __metadata("design:type", String)
], Vehiculo.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado', nullable: true }),
    __metadata("design:type", Number)
], Vehiculo.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], Vehiculo.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Vehiculo.prototype, "deleted_at", void 0);
exports.Vehiculo = Vehiculo = __decorate([
    (0, typeorm_1.Entity)('Vehiculo')
], Vehiculo);
//# sourceMappingURL=vehiculo.entity.js.map