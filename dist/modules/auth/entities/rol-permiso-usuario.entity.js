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
exports.RolPermisoUsuario = void 0;
const typeorm_1 = require("typeorm");
const rol_permiso_entity_1 = require("./rol-permiso.entity");
const usuario_entity_1 = require("./usuario.entity");
let RolPermisoUsuario = class RolPermisoUsuario {
    ID_Rol;
    ID_Permiso;
    ID_Usuario;
    fecha_asignacion;
    rolPermiso;
    usuario;
    deleted_at;
};
exports.RolPermisoUsuario = RolPermisoUsuario;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Rol' }),
    __metadata("design:type", Number)
], RolPermisoUsuario.prototype, "ID_Rol", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Permiso' }),
    __metadata("design:type", Number)
], RolPermisoUsuario.prototype, "ID_Permiso", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ID_Usuario' }),
    __metadata("design:type", Number)
], RolPermisoUsuario.prototype, "ID_Usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_asignacion', type: 'date' }),
    __metadata("design:type", Date)
], RolPermisoUsuario.prototype, "fecha_asignacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rol_permiso_entity_1.RolPermiso),
    (0, typeorm_1.JoinColumn)([
        { name: 'ID_Rol', referencedColumnName: 'ID_Rol' },
        { name: 'ID_Permiso', referencedColumnName: 'ID_Permiso' }
    ]),
    __metadata("design:type", rol_permiso_entity_1.RolPermiso)
], RolPermisoUsuario.prototype, "rolPermiso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], RolPermisoUsuario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], RolPermisoUsuario.prototype, "deleted_at", void 0);
exports.RolPermisoUsuario = RolPermisoUsuario = __decorate([
    (0, typeorm_1.Entity)('rol_permiso_usuario')
], RolPermisoUsuario);
//# sourceMappingURL=rol-permiso-usuario.entity.js.map