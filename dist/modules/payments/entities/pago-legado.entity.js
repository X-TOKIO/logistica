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
exports.PagoLegado = void 0;
const typeorm_1 = require("typeorm");
const nota_compra_entity_1 = require("./nota-compra.entity");
let PagoLegado = class PagoLegado {
    ID_Pago;
    Fecha;
    Plazo;
    MontoTotal;
    ID_Compra;
    notaCompra;
    deleted_at;
};
exports.PagoLegado = PagoLegado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Pago' }),
    __metadata("design:type", Number)
], PagoLegado.prototype, "ID_Pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha', type: 'date' }),
    __metadata("design:type", Date)
], PagoLegado.prototype, "Fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Plazo', type: 'int' }),
    __metadata("design:type", Number)
], PagoLegado.prototype, "Plazo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MontoTotal', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PagoLegado.prototype, "MontoTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Compra', unique: true }),
    __metadata("design:type", Number)
], PagoLegado.prototype, "ID_Compra", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => nota_compra_entity_1.NotaCompra),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Compra' }),
    __metadata("design:type", nota_compra_entity_1.NotaCompra)
], PagoLegado.prototype, "notaCompra", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], PagoLegado.prototype, "deleted_at", void 0);
exports.PagoLegado = PagoLegado = __decorate([
    (0, typeorm_1.Entity)('Pago')
], PagoLegado);
//# sourceMappingURL=pago-legado.entity.js.map