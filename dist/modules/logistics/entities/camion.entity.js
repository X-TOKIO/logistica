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
exports.Camion = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
let Camion = class Camion {
    ID_Camion;
    Placa;
    Modelo;
    CapacidadCarga;
    Estado;
    ID_Empleado;
    empleado;
    deleted_at;
};
exports.Camion = Camion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Camion' }),
    __metadata("design:type", Number)
], Camion.prototype, "ID_Camion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Placa', length: 20, unique: true }),
    __metadata("design:type", String)
], Camion.prototype, "Placa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Modelo', length: 100 }),
    __metadata("design:type", String)
], Camion.prototype, "Modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CapacidadCarga', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Camion.prototype, "CapacidadCarga", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 50 }),
    __metadata("design:type", String)
], Camion.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], Camion.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], Camion.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Camion.prototype, "deleted_at", void 0);
exports.Camion = Camion = __decorate([
    (0, typeorm_1.Entity)('Camion')
], Camion);
//# sourceMappingURL=camion.entity.js.map