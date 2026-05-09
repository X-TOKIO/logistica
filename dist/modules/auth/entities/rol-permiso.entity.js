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
exports.RolPermiso = void 0;
const typeorm_1 = require("typeorm");
const rol_entity_1 = require("./rol.entity");
const permiso_entity_1 = require("./permiso.entity");
let RolPermiso = class RolPermiso {
    ID_Rol;
    ID_Permiso;
    rol;
    permiso;
    deleted_at;
};
exports.RolPermiso = RolPermiso;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Rol' }),
    __metadata("design:type", Number)
], RolPermiso.prototype, "ID_Rol", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Permiso' }),
    __metadata("design:type", Number)
], RolPermiso.prototype, "ID_Permiso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rol_entity_1.Rol),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Rol' }),
    __metadata("design:type", rol_entity_1.Rol)
], RolPermiso.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permiso_entity_1.Permiso),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Permiso' }),
    __metadata("design:type", permiso_entity_1.Permiso)
], RolPermiso.prototype, "permiso", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], RolPermiso.prototype, "deleted_at", void 0);
exports.RolPermiso = RolPermiso = __decorate([
    (0, typeorm_1.Entity)('rol_permiso')
], RolPermiso);
//# sourceMappingURL=rol-permiso.entity.js.map