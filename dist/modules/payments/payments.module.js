"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nota_compra_entity_1 = require("./entities/nota-compra.entity");
const detalle_compra_entity_1 = require("./entities/detalle-compra.entity");
const cuenta_por_pagar_entity_1 = require("./entities/cuenta-por-pagar.entity");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const pago_entity_1 = require("./entities/pago.entity");
const pago_legado_entity_1 = require("./entities/pago-legado.entity");
const plan_pago_entity_1 = require("./entities/plan-pago.entity");
const cuota_cxp_entity_1 = require("./entities/cuota-cxp.entity");
const producto_entity_1 = require("../warehouse/entities/producto.entity");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const payments_webhook_controller_1 = require("./payments-webhook.controller");
const libelula_service_1 = require("./libelula.service");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                nota_compra_entity_1.NotaCompra, detalle_compra_entity_1.DetalleCompra, cuenta_por_pagar_entity_1.CuentaPorPagar, cuota_cxp_entity_1.CuotaCxP,
                proveedor_entity_1.Proveedor, pago_entity_1.Pago, pago_legado_entity_1.PagoLegado, plan_pago_entity_1.PlanPago, producto_entity_1.Producto, usuario_entity_1.Usuario,
            ]),
        ],
        controllers: [payments_controller_1.PaymentsController, payments_webhook_controller_1.PaymentsWebhookController],
        providers: [payments_service_1.PaymentsService, libelula_service_1.LibelulaService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map