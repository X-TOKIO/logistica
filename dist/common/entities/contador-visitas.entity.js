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
exports.ContadorVisitas = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../../modules/auth/entities/usuario.entity");
let ContadorVisitas = class ContadorVisitas {
    ID_Visita;
    NombrePagina;
    Contador;
    UltimaVisita;
    ID_Usuario;
    usuario;
    deleted_at;
};
exports.ContadorVisitas = ContadorVisitas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Visita' }),
    __metadata("design:type", Number)
], ContadorVisitas.prototype, "ID_Visita", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NombrePagina', length: 200 }),
    __metadata("design:type", String)
], ContadorVisitas.prototype, "NombrePagina", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Contador', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ContadorVisitas.prototype, "Contador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UltimaVisita', type: 'timestamp' }),
    __metadata("design:type", Date)
], ContadorVisitas.prototype, "UltimaVisita", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Usuario' }),
    __metadata("design:type", Number)
], ContadorVisitas.prototype, "ID_Usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], ContadorVisitas.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], ContadorVisitas.prototype, "deleted_at", void 0);
exports.ContadorVisitas = ContadorVisitas = __decorate([
    (0, typeorm_1.Entity)('ContadorVisitas')
], ContadorVisitas);
//# sourceMappingURL=contador-visitas.entity.js.map