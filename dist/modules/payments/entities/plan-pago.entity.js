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
exports.PlanPago = void 0;
const typeorm_1 = require("typeorm");
const pago_legado_entity_1 = require("./pago-legado.entity");
let PlanPago = class PlanPago {
    ID_Pago;
    ID_Cuota;
    Fecha;
    Monto;
    Estado;
    pago;
    deleted_at;
};
exports.PlanPago = PlanPago;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Pago' }),
    __metadata("design:type", Number)
], PlanPago.prototype, "ID_Pago", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Cuota' }),
    __metadata("design:type", Number)
], PlanPago.prototype, "ID_Cuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha', type: 'date' }),
    __metadata("design:type", Date)
], PlanPago.prototype, "Fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Monto', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PlanPago.prototype, "Monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 50 }),
    __metadata("design:type", String)
], PlanPago.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pago_legado_entity_1.PagoLegado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Pago' }),
    __metadata("design:type", pago_legado_entity_1.PagoLegado)
], PlanPago.prototype, "pago", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], PlanPago.prototype, "deleted_at", void 0);
exports.PlanPago = PlanPago = __decorate([
    (0, typeorm_1.Entity)('PlanPago')
], PlanPago);
//# sourceMappingURL=plan-pago.entity.js.map