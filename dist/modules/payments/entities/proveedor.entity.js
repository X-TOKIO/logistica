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
exports.Proveedor = void 0;
const typeorm_1 = require("typeorm");
let Proveedor = class Proveedor {
    ID_Proveedor;
    Nombre_RazonSocial;
    NIT;
    Telefono;
    Direccion;
    Estado;
    deleted_at;
};
exports.Proveedor = Proveedor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Proveedor' }),
    __metadata("design:type", Number)
], Proveedor.prototype, "ID_Proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Nombre_RazonSocial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NIT', length: 50, unique: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "NIT", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Telefono', length: 30, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Direccion', length: 300, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 20, default: 'ACTIVO' }),
    __metadata("design:type", String)
], Proveedor.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Proveedor.prototype, "deleted_at", void 0);
exports.Proveedor = Proveedor = __decorate([
    (0, typeorm_1.Entity)('Proveedor')
], Proveedor);
//# sourceMappingURL=proveedor.entity.js.map