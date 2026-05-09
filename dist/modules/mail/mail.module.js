"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const correo_enviado_entity_1 = require("./entities/correo-enviado.entity");
const mail_service_1 = require("./mail.service");
const mail_controller_1 = require("./mail.controller");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
const producto_entity_1 = require("../warehouse/entities/producto.entity");
const plan_pago_entity_1 = require("../payments/entities/plan-pago.entity");
const despacho_entity_1 = require("../logistics/entities/despacho.entity");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([correo_enviado_entity_1.CorreoEnviado, usuario_entity_1.Usuario, producto_entity_1.Producto, plan_pago_entity_1.PlanPago, despacho_entity_1.Despacho])],
        controllers: [mail_controller_1.MailController],
        providers: [mail_service_1.MailService]
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map