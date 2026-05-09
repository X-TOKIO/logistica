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
exports.Empleado = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
let Empleado = class Empleado {
    ID_Empleado;
    Nombre;
    Materno;
    Paterno;
    CI;
    Telefono;
    Direccion;
    Cargo;
    FechaContratacion;
    Image;
    usuario;
    deleted_at;
};
exports.Empleado = Empleado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], Empleado.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100 }),
    __metadata("design:type", String)
], Empleado.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Materno', length: 100, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Materno", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Paterno', length: 100, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Paterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CI', length: 20, unique: true }),
    __metadata("design:type", String)
], Empleado.prototype, "CI", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Telefono', length: 20, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Direccion', length: 200, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cargo', length: 100, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Cargo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaContratacion', type: 'date' }),
    __metadata("design:type", Date)
], Empleado.prototype, "FechaContratacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Image', length: 300, nullable: true }),
    __metadata("design:type", String)
], Empleado.prototype, "Image", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usuario_entity_1.Usuario, usuario => usuario.empleado),
    __metadata("design:type", usuario_entity_1.Usuario)
], Empleado.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Empleado.prototype, "deleted_at", void 0);
exports.Empleado = Empleado = __decorate([
    (0, typeorm_1.Entity)('Empleado')
], Empleado);
//# sourceMappingURL=empleado.entity.js.map