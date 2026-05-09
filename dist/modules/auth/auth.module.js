"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const access_controller_1 = require("./access.controller");
const empleados_controller_1 = require("./empleados.controller");
const usuarios_controller_1 = require("./usuarios.controller");
const jwt_strategy_1 = require("../../common/strategies/jwt.strategy");
const usuario_entity_1 = require("./entities/usuario.entity");
const empleado_entity_1 = require("./entities/empleado.entity");
const rol_permiso_usuario_entity_1 = require("./entities/rol-permiso-usuario.entity");
const rol_permiso_entity_1 = require("./entities/rol-permiso.entity");
const rol_entity_1 = require("./entities/rol.entity");
const permiso_entity_1 = require("./entities/permiso.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, empleado_entity_1.Empleado, rol_permiso_usuario_entity_1.RolPermisoUsuario, rol_permiso_entity_1.RolPermiso, rol_entity_1.Rol, permiso_entity_1.Permiso]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRATION', '8h') },
                })
            })
        ],
        controllers: [auth_controller_1.AuthController, access_controller_1.AccessController, access_controller_1.RolesController, access_controller_1.PermisosController, empleados_controller_1.EmpleadosController, usuarios_controller_1.UsuariosController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map