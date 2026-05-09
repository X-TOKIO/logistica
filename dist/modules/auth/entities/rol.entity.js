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
exports.Rol = void 0;
const typeorm_1 = require("typeorm");
const rol_permiso_entity_1 = require("./rol-permiso.entity");
let Rol = class Rol {
    ID_Rol;
    Nombre;
    Descripcion;
    rolPermisos;
    deleted_at;
};
exports.Rol = Rol;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Rol' }),
    __metadata("design:type", Number)
], Rol.prototype, "ID_Rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre', length: 100 }),
    __metadata("design:type", String)
], Rol.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Descripcion', length: 300, nullable: true }),
    __metadata("design:type", String)
], Rol.prototype, "Descripcion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rol_permiso_entity_1.RolPermiso, (rolPermiso) => rolPermiso.rol, { cascade: true }),
    __metadata("design:type", Array)
], Rol.prototype, "rolPermisos", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Rol.prototype, "deleted_at", void 0);
exports.Rol = Rol = __decorate([
    (0, typeorm_1.Entity)('Rol')
], Rol);
//# sourceMappingURL=rol.entity.js.map