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
exports.Almacen = void 0;
const typeorm_1 = require("typeorm");
let Almacen = class Almacen {
    ID_Almacen;
    Nombre;
    Direccion;
    Latitud;
    Longitud;
    Color;
    deleted_at;
};
exports.Almacen = Almacen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", Number)
], Almacen.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100 }),
    __metadata("design:type", String)
], Almacen.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Direccion', length: 200 }),
    __metadata("design:type", String)
], Almacen.prototype, "Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Latitud', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Almacen.prototype, "Latitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Longitud', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Almacen.prototype, "Longitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Color', length: 20, nullable: true, default: '#6366f1' }),
    __metadata("design:type", String)
], Almacen.prototype, "Color", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Almacen.prototype, "deleted_at", void 0);
exports.Almacen = Almacen = __decorate([
    (0, typeorm_1.Entity)('Almacen')
], Almacen);
//# sourceMappingURL=almacen.entity.js.map