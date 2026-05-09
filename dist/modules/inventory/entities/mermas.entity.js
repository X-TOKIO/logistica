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
exports.Mermas = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
const detalle_merma_entity_1 = require("./detalle-merma.entity");
let Mermas = class Mermas {
    ID_Merma;
    Fecha;
    MotivoPerdida;
    ID_Empleado;
    empleado;
    detalles;
    deleted_at;
};
exports.Mermas = Mermas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Merma' }),
    __metadata("design:type", Number)
], Mermas.prototype, "ID_Merma", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Fecha', type: 'date' }),
    __metadata("design:type", Date)
], Mermas.prototype, "Fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MotivoPerdida', length: 300 }),
    __metadata("design:type", String)
], Mermas.prototype, "MotivoPerdida", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], Mermas.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], Mermas.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_merma_entity_1.DetalleMerma, (d) => d.merma),
    __metadata("design:type", Array)
], Mermas.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Mermas.prototype, "deleted_at", void 0);
exports.Mermas = Mermas = __decorate([
    (0, typeorm_1.Entity)('Mermas')
], Mermas);
//# sourceMappingURL=mermas.entity.js.map