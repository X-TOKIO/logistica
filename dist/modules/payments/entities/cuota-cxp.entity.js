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
exports.CuotaCxP = void 0;
const typeorm_1 = require("typeorm");
const cuenta_por_pagar_entity_1 = require("./cuenta-por-pagar.entity");
let CuotaCxP = class CuotaCxP {
    ID_CuotaCxP;
    ID_Cuenta;
    Numero_Cuota;
    Fecha_Vencimiento;
    Monto;
    Estado;
    cuentaPorPagar;
};
exports.CuotaCxP = CuotaCxP;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_CuotaCxP' }),
    __metadata("design:type", Number)
], CuotaCxP.prototype, "ID_CuotaCxP", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Cuenta' }),
    __metadata("design:type", Number)
], CuotaCxP.prototype, "ID_Cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Numero_Cuota', type: 'int' }),
    __metadata("design:type", Number)
], CuotaCxP.prototype, "Numero_Cuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Vencimiento', type: 'date' }),
    __metadata("design:type", Date)
], CuotaCxP.prototype, "Fecha_Vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Monto', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CuotaCxP.prototype, "Monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 20, default: 'PENDIENTE' }),
    __metadata("design:type", String)
], CuotaCxP.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_por_pagar_entity_1.CuentaPorPagar, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Cuenta' }),
    __metadata("design:type", cuenta_por_pagar_entity_1.CuentaPorPagar)
], CuotaCxP.prototype, "cuentaPorPagar", void 0);
exports.CuotaCxP = CuotaCxP = __decorate([
    (0, typeorm_1.Entity)('CuotaCxP')
], CuotaCxP);
//# sourceMappingURL=cuota-cxp.entity.js.map