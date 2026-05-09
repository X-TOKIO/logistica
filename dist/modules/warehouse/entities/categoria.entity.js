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
exports.Categoria = void 0;
const typeorm_1 = require("typeorm");
let Categoria = class Categoria {
    ID_Categoria;
    NombreC;
    Descripcion;
    deleted_at;
};
exports.Categoria = Categoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Categoria' }),
    __metadata("design:type", Number)
], Categoria.prototype, "ID_Categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NombreC', length: 100 }),
    __metadata("design:type", String)
], Categoria.prototype, "NombreC", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Descripcion', length: 250, nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "Descripcion", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Categoria.prototype, "deleted_at", void 0);
exports.Categoria = Categoria = __decorate([
    (0, typeorm_1.Entity)('Categoria')
], Categoria);
//# sourceMappingURL=categoria.entity.js.map