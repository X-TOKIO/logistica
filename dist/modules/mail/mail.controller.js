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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("../warehouse/entities/producto.entity");
const plan_pago_entity_1 = require("../payments/entities/plan-pago.entity");
const despacho_entity_1 = require("../logistics/entities/despacho.entity");
let MailController = class MailController {
    mailSrv;
    prodRepo;
    planRepo;
    despRepo;
    constructor(mailSrv, prodRepo, planRepo, despRepo) {
        this.mailSrv = mailSrv;
        this.prodRepo = prodRepo;
        this.planRepo = planRepo;
        this.despRepo = despRepo;
    }
    async enviarResumenPdf(req, body) {
        if (!body.email)
            throw new common_1.BadRequestException("Dirección de email destinataria no provista.");
        let pdfBuffer;
        if (body.reportType === 'INVENTARIO') {
            const rows = await this.prodRepo.manager.query(`
              SELECT p."ID_Producto" as id, p."CodigoBarra" as codigo, p."Nombre" as nombre, 
                     p."PrecioUnitario" as precio, COALESCE(SUM(pa."Stock_Actual"), 0) as stock
              FROM "Producto" p
              LEFT JOIN "ProductoAlmacen" pa ON pa."ID_Producto" = p."ID_Producto"
              GROUP BY p."ID_Producto"
          `);
            pdfBuffer = await this.mailSrv.buildPdfInventario(rows);
        }
        else if (body.reportType === 'CUENTAS') {
            const rows = await this.planRepo.createQueryBuilder('pp')
                .leftJoinAndSelect('pp.pago', 'p')
                .leftJoinAndSelect('p.notaCompra', 'nc')
                .leftJoinAndSelect('nc.proveedor', 'prov')
                .where('pp.Estado = :est', { est: 'PENDIENTE' })
                .getMany();
            const mapped = rows.map(r => ({
                proveedor: r.pago.notaCompra.proveedor.Nombre_RazonSocial, nit: r.pago.notaCompra.proveedor.NIT,
                compra: r.pago.notaCompra.ID_Compra, cuota: r.ID_Cuota, monto: r.Monto, fecha: r.Fecha
            }));
            pdfBuffer = await this.mailSrv.buildPdfCuentas(mapped);
        }
        else if (body.reportType === 'DESPACHOS') {
            const joinedRows = await this.despRepo.manager.query(`
              SELECT d."ID_Despacho" as id, d."FechaSalida" as fecha, c."Placa" as camion, s."Nombre" as destino, dc."EstadoDeEnvio" as estado
              FROM "Despacho" d
              JOIN "despacho_camion" dc ON dc."ID_Despacho" = d."ID_Despacho"
              JOIN "Camion" c ON c."ID_Camion" = dc."ID_Camion"
              JOIN "Ruta" r ON r."ID_Ruta" = d."ID_Ruta"
              JOIN "Sucursal" s ON s."ID_Sucursal" = r."ID_Sucursal"
          `);
            pdfBuffer = await this.mailSrv.buildPdfDespachos(joinedRows);
        }
        else {
            throw new common_1.BadRequestException("Tipo de Reporte Solicitado es Inválido");
        }
        return this.mailSrv.sendReport(req.user.sub, body.email, body.reportType, pdfBuffer);
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Post)('enviar'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "enviarResumenPdf", null);
exports.MailController = MailController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('MODULO_REPORTES'),
    (0, common_1.Controller)('mail/reportes'),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_pago_entity_1.PlanPago)),
    __param(3, (0, typeorm_1.InjectRepository)(despacho_entity_1.Despacho)),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MailController);
//# sourceMappingURL=mail.controller.js.map