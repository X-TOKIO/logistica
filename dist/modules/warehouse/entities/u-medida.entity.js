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
exports.UMedida = void 0;
const typeorm_1 = require("typeorm");
let UMedida = class UMedida {
    ID_Medida;
    Nombre;
    Abreviatura;
    Unidades_Bulto;
    factor_conversion;
    deleted_at;
};
exports.UMedida = UMedida;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Medida' }),
    __metadata("design:type", Number)
], UMedida.prototype, "ID_Medida", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100 }),
    __metadata("design:type", String)
], UMedida.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Abreviatura', length: 20 }),
    __metadata("design:type", String)
], UMedida.prototype, "Abreviatura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Unidades_Bulto', type: 'varchar', length: 20, default: '1' }),
    __metadata("design:type", String)
], UMedida.prototype, "Unidades_Bulto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'factor_conversion', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], UMedida.prototype, "factor_conversion", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], UMedida.prototype, "deleted_at", void 0);
exports.UMedida = UMedida = __decorate([
    (0, typeorm_1.Entity)('UMedida')
], UMedida);
//# sourceMappingURL=u-medida.entity.js.map