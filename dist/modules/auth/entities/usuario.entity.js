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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("./empleado.entity");
const rol_permiso_usuario_entity_1 = require("./rol-permiso-usuario.entity");
let Usuario = class Usuario {
    ID_Usuario;
    UserName;
    Password;
    Email;
    Estado;
    intentosFallidos;
    bloqueadoHasta;
    ultimoLogin;
    ID_Empleado;
    ID_Rol;
    empleado;
    asignaciones;
    deleted_at;
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Usuario' }),
    __metadata("design:type", Number)
], Usuario.prototype, "ID_Usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UserName', length: 100, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "UserName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Password', length: 300, select: false }),
    __metadata("design:type", String)
], Usuario.prototype, "Password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Email', length: 150, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "Email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado', length: 50 }),
    __metadata("design:type", String)
], Usuario.prototype, "Estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'intentosFallidos', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "intentosFallidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bloqueadoHasta', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "bloqueadoHasta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ultimoLogin', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "ultimoLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado', unique: true }),
    __metadata("design:type", Number)
], Usuario.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Rol', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "ID_Rol", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => empleado_entity_1.Empleado, empleado => empleado.usuario),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], Usuario.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rol_permiso_usuario_entity_1.RolPermisoUsuario, rpu => rpu.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "asignaciones", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Usuario.prototype, "deleted_at", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('Usuario')
], Usuario);
//# sourceMappingURL=usuario.entity.js.map