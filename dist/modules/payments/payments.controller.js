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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const libelula_service_1 = require("./libelula.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let PaymentsController = class PaymentsController {
    srv;
    libelula;
    constructor(srv, libelula) {
        this.srv = srv;
        this.libelula = libelula;
    }
    getCompras() { return this.srv.getCompras(); }
    getCompraStatus(id) { return this.srv.getCompraStatus(Number(id)); }
    getCompraById(id) { return this.srv.getCompraById(Number(id)); }
    createCompra(req, dto) {
        return this.srv.createCompra(dto, req.user.userId);
    }
    anularCompra(id) { return this.srv.anularCompra(Number(id)); }
    async generarQRLibelula(dto) {
        let idTransaccion;
        let cachedQrUrl = null;
        let cachedIdLibelula = null;
        if (dto.idCompra) {
            const ref = await this.srv.obtenerOCrearTransaccionLibelula(dto.idCompra);
            idTransaccion = ref.idTransaccion;
            cachedQrUrl = ref.qrUrl;
            cachedIdLibelula = ref.idLibelula;
        }
        else {
            idTransaccion = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        }
        if (cachedQrUrl) {
            return { idTransaccion, qrUrl: cachedQrUrl };
        }
        const result = await this.libelula.generarPagoQR({
            monto: dto.monto,
            glosa: dto.glosa ?? 'Pago PARADISO',
            idTransaccion,
            email: dto.email,
        });
        const qrUrlToSave = result.qrUrl ?? result.pasarelaUrl;
        if (dto.idCompra && (qrUrlToSave || result.idLibelula || result.codigoRecaudacion)) {
            await this.srv.guardarQrUrl(dto.idCompra, qrUrlToSave ?? '', result.idLibelula, result.codigoRecaudacion);
        }
        return result;
    }
    async verificarPagoLibelula(id) {
        const idCompra = Number(id);
        const compra = await this.srv.getCompraById(idCompra);
        if (!compra)
            throw new Error(`Compra #${idCompra} no encontrada.`);
        if (compra.Estado_Documento === 'ACTIVO') {
            return { confirmado: true, mensaje: 'El pago ya fue confirmado.' };
        }
        const refLibelula = compra.Ref_Libelula;
        const idLibelula = compra.Id_Libelula;
        const codRecaudacion = compra.Codigo_Recaudacion;
        const refsPrevias = JSON.parse(compra.Refs_Previas ?? '[]');
        if (idLibelula || codRecaudacion) {
            const resultado = await this.libelula.consultarDeuda({
                idTransaccion: idLibelula ?? undefined,
                codigoRecaudacion: codRecaudacion ?? undefined,
                identificadorDeuda: refLibelula ?? undefined,
            });
            if (resultado.pagado) {
                await this.srv.confirmarPagoQR(idCompra);
                return { confirmado: true, mensaje: 'Pago verificado y compra activada.' };
            }
        }
        if (refLibelula && !idLibelula && !codRecaudacion) {
            const resultado = await this.libelula.consultarDeuda({ identificadorDeuda: refLibelula });
            if (resultado.pagado) {
                await this.srv.confirmarPagoQR(idCompra);
                return { confirmado: true, mensaje: 'Pago verificado con identificador_deuda.' };
            }
        }
        for (const ref of refsPrevias) {
            const resultado = await this.libelula.consultarDeuda({ identificadorDeuda: ref });
            if (resultado.pagado) {
                await this.srv.confirmarPagoQR(idCompra);
                return { confirmado: true, mensaje: `Pago verificado con ref histórica ${ref}.` };
            }
        }
        const sinIds = !idLibelula && !codRecaudacion;
        return {
            confirmado: false,
            mensaje: sinIds
                ? 'Sin UUID ni código de recaudación guardados. Usa PATCH /libelula-ids para fijarlos manualmente.'
                : 'Libélula no reporta el pago como procesado aún.',
        };
    }
    setLibelulaIds(id, dto) {
        return this.srv.actualizarIdsLibelula(Number(id), dto);
    }
    generateQR(id) { return this.srv.generateQR(Number(id)); }
    generateQRPaymentRef(id) {
        return this.srv.generateQRPaymentRef(Number(id));
    }
    webhookQRConfirm(dto) {
        return this.srv.webhookQRConfirm(dto);
    }
    confirmarPagoQR(id) { return this.srv.confirmarPagoQR(Number(id)); }
    getCuentasPorPagar() { return this.srv.getCuentasPorPagar(); }
    getAlertasCxP() { return this.srv.getAlertasCxP(); }
    getCuentaPorPagarById(id) {
        return this.srv.getCuentaPorPagarById(Number(id));
    }
    getHistorialPagos(id) {
        return this.srv.getHistorialPagosCuenta(Number(id));
    }
    pollingCxP(id) {
        return this.srv.pollingCxP(Number(id));
    }
    getCuotasCuenta(id) { return this.srv.getCuotasCuenta(Number(id)); }
    marcarCuentaPagada(id) { return this.srv.marcarCuentaPagada(Number(id)); }
    registrarPago(req, dto) {
        return this.srv.registrarPago(dto, req.user.userId);
    }
    getCuentasLegado() { return this.srv.getCuentasPorPagarLegado(); }
    pagarCuota(idPago, idCuota) {
        return this.srv.marcarPago(Number(idPago), Number(idCuota));
    }
    getProveedores() { return this.srv.getProveedores(); }
    getEstadisticas() { return this.srv.getEstadisticas(); }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_FINANZAS', 'MODULO_REPORTES', 'MODULO_INVENTARIO'),
    (0, common_1.Get)('compras'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCompras", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_FINANZAS', 'MODULO_INVENTARIO'),
    (0, common_1.Get)('compras/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCompraStatus", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_FINANZAS', 'MODULO_INVENTARIO'),
    (0, common_1.Get)('compras/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCompraById", null);
__decorate([
    (0, common_1.Post)('compras'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createCompra", null);
__decorate([
    (0, common_1.Patch)('compras/:id/anular'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "anularCompra", null);
__decorate([
    (0, common_1.Post)('generar-qr'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "generarQRLibelula", null);
__decorate([
    (0, common_1.Get)('compras/:id/verificar-pago'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verificarPagoLibelula", null);
__decorate([
    (0, common_1.Patch)('compras/:id/libelula-ids'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "setLibelulaIds", null);
__decorate([
    (0, common_1.Get)('qr/generate/:idCompra'),
    __param(0, (0, common_1.Param)('idCompra')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "generateQR", null);
__decorate([
    (0, common_1.Get)('qr/payment-ref/:idCuenta'),
    __param(0, (0, common_1.Param)('idCuenta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "generateQRPaymentRef", null);
__decorate([
    (0, common_1.Post)('webhook/cxp-confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "webhookQRConfirm", null);
__decorate([
    (0, common_1.Post)('webhook/qr-confirm/:idCompra'),
    __param(0, (0, common_1.Param)('idCompra')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "confirmarPagoQR", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCuentasPorPagar", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar/alertas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getAlertasCxP", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCuentaPorPagarById", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar/:id/pagos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getHistorialPagos", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar/:id/polling'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "pollingCxP", null);
__decorate([
    (0, common_1.Get)('cuentas-por-pagar/:id/cuotas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCuotasCuenta", null);
__decorate([
    (0, common_1.Patch)('cuentas-por-pagar/:id/pagar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "marcarCuentaPagada", null);
__decorate([
    (0, common_1.Post)('pagos'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "registrarPago", null);
__decorate([
    (0, common_1.Get)('cuentas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCuentasLegado", null);
__decorate([
    (0, common_1.Post)('pagar/:idPago/:idCuota'),
    __param(0, (0, common_1.Param)('idPago')),
    __param(1, (0, common_1.Param)('idCuota')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "pagarCuota", null);
__decorate([
    (0, common_1.Get)('proveedores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getProveedores", null);
__decorate([
    (0, permissions_decorator_1.RequirePermissions)('MODULO_FINANZAS', 'MODULO_REPORTES'),
    (0, common_1.Get)('estadisticas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getEstadisticas", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_FINANZAS'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        libelula_service_1.LibelulaService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map