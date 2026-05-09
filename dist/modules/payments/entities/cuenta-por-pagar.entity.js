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
exports.CuentaPorPagar = void 0;
const typeorm_1 = require("typeorm");
const nota_compra_entity_1 = require("./nota-compra.entity");
const cuota_cxp_entity_1 = require("./cuota-cxp.entity");
let CuentaPorPagar = class CuentaPorPagar {
    ID_Cuenta;
    Saldo_Pendiente;
    Fecha_Vencimiento;
    Estado_Pago;
    ID_Compra;
    notaCompra;
    cuotas;
    deleted_at;
};
exports.CuentaPorPagar = CuentaPorPagar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Cuenta' }),
    __metadata("design:type", Number)
], CuentaPorPagar.prototype, "ID_Cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Saldo_Pendiente', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CuentaPorPagar.prototype, "Saldo_Pendiente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha_Vencimiento', type: 'date' }),
    __metadata("design:type", Date)
], CuentaPorPagar.prototype, "Fecha_Vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado_Pago', length: 20, default: 'PENDIENTE' }),
    __metadata("design:type", String)
], CuentaPorPagar.prototype, "Estado_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Compra' }),
    __metadata("design:type", Number)
], CuentaPorPagar.prototype, "ID_Compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nota_compra_entity_1.NotaCompra),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Compra' }),
    __metadata("design:type", nota_compra_entity_1.NotaCompra)
], CuentaPorPagar.prototype, "notaCompra", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuota_cxp_entity_1.CuotaCxP, c => c.cuentaPorPagar),
    __metadata("design:type", Array)
], CuentaPorPagar.prototype, "cuotas", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], CuentaPorPagar.prototype, "deleted_at", void 0);
exports.CuentaPorPagar = CuentaPorPagar = __decorate([
    (0, typeorm_1.Entity)('CuentaPorPagar')
], CuentaPorPagar);
//# sourceMappingURL=cuenta-por-pagar.entity.js.map