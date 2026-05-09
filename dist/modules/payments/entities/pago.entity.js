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
exports.Pago = void 0;
const typeorm_1 = require("typeorm");
const cuenta_por_pagar_entity_1 = require("./cuenta-por-pagar.entity");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
let Pago = class Pago {
    ID_Pago;
    Monto_Pagado;
    Fecha_Pago;
    Metodo_Pago;
    Referencia_Comprobante;
    Observaciones;
    ID_Cuenta;
    cuentaPorPagar;
    ID_Empleado;
    empleado;
    deleted_at;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Pago' }),
    __metadata("design:type", Number)
], Pago.prototype, "ID_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Monto_Pagado', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pago.prototype, "Monto_Pagado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Pago', type: 'date' }),
    __metadata("design:type", Date)
], Pago.prototype, "Fecha_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Metodo_Pago', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Pago.prototype, "Metodo_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "Referencia_Comprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "Observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Cuenta' }),
    __metadata("design:type", Number)
], Pago.prototype, "ID_Cuenta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_por_pagar_entity_1.CuentaPorPagar),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Cuenta' }),
    __metadata("design:type", cuenta_por_pagar_entity_1.CuentaPorPagar)
], Pago.prototype, "cuentaPorPagar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], Pago.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], Pago.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Pago.prototype, "deleted_at", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('RegistroPago')
], Pago);
//# sourceMappingURL=pago.entity.js.map