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
exports.DespachoCamion = void 0;
const typeorm_1 = require("typeorm");
const despacho_entity_1 = require("./despacho.entity");
const camion_entity_1 = require("./camion.entity");
let DespachoCamion = class DespachoCamion {
    ID_Despacho;
    ID_Camion;
    EstadoDeEnvio;
    despacho;
    camion;
    deleted_at;
};
exports.DespachoCamion = DespachoCamion;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Despacho' }),
    __metadata("design:type", Number)
], DespachoCamion.prototype, "ID_Despacho", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Camion' }),
    __metadata("design:type", Number)
], DespachoCamion.prototype, "ID_Camion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EstadoDeEnvio', length: 100 }),
    __metadata("design:type", String)
], DespachoCamion.prototype, "EstadoDeEnvio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => despacho_entity_1.Despacho),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Despacho' }),
    __metadata("design:type", despacho_entity_1.Despacho)
], DespachoCamion.prototype, "despacho", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => camion_entity_1.Camion),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Camion' }),
    __metadata("design:type", camion_entity_1.Camion)
], DespachoCamion.prototype, "camion", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], DespachoCamion.prototype, "deleted_at", void 0);
exports.DespachoCamion = DespachoCamion = __decorate([
    (0, typeorm_1.Entity)('despacho_camion')
], DespachoCamion);
//# sourceMappingURL=despacho-camion.entity.js.map