"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = __importStar(require("nodemailer"));
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
const correo_enviado_entity_1 = require("./entities/correo-enviado.entity");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
let MailService = class MailService {
    correoRepo;
    usrRepo;
    transporter;
    constructor(correoRepo, usrRepo) {
        this.correoRepo = correoRepo;
        this.usrRepo = usrRepo;
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }
    async buildPdfInventario(productos) {
        return new Promise((resolve) => {
            const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
            doc.fontSize(14).text('Reporte de Inventario Actual (Métricas Constelacionales)', { align: 'center' }).moveDown();
            const table = {
                title: "Existencias Globales (Riesgo < 10 Unidades)",
                headers: ["Código/ID", "Producto", "Stock Actual", "Precio Vta", "Valor Almacenado"],
                rows: productos.map(p => [
                    (p.codigo || p.id).toString(), p.nombre, p.stock.toString(), `Bs. ${p.precio}`, `Bs. ${(parseFloat(p.stock) * parseFloat(p.precio)).toFixed(2)}`
                ]),
            };
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: (row) => {
                    const stockStr = row[2];
                    if (parseFloat(stockStr) < 10) {
                        doc.font("Helvetica-Bold").fillColor('red');
                    }
                    else {
                        doc.font("Helvetica").fillColor('black');
                    }
                    doc.fontSize(10);
                    return doc;
                }
            });
            doc.end();
        });
    }
    async buildPdfCuentas(deudas) {
        return new Promise((resolve) => {
            const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.fontSize(20).text('PARADISO FINANCES', { align: 'center' }).moveDown();
            doc.fontSize(14).text('Estado de Cuentas por Pagar (Proveedores / Cuotas)', { align: 'center' }).moveDown();
            const table = {
                title: "Facturas en Estado PENDIENTE",
                headers: ["Prov (NIT)", "Compra_Ref", "Cuota N°", "Monto Cuota", "Expiración"],
                rows: deudas.map(d => [
                    `${d.proveedor} (${d.nit})`, d.compra.toString(), d.cuota.toString(), `Bs. ${d.monto}`, new Date(d.fecha).toLocaleDateString()
                ]),
            };
            doc.table(table, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10), prepareRow: () => doc.font("Helvetica").fillColor('black').fontSize(10) });
            doc.end();
        });
    }
    async buildPdfDespachos(despachos) {
        return new Promise((resolve) => {
            const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
            doc.fontSize(14).text('Historial Base de Despachos Terrestres', { align: 'center' }).moveDown();
            const table = {
                title: "Bitácora Terrestre y Rastreo de Flotas",
                headers: ["DSP_ID", "Fecha Salida", "Camión Placa", "Sucursal Destino", "Estado de Envio"],
                rows: despachos.map(d => [
                    d.id.toString(), new Date(d.fecha).toLocaleDateString(), d.camion, d.destino, d.estado
                ]),
            };
            doc.table(table, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10), prepareRow: () => doc.font("Helvetica").fillColor('black').fontSize(10) });
            doc.end();
        });
    }
    async sendReport(userId, email, reportType, pdfBuffer) {
        const subjectMap = {
            'INVENTARIO': 'Reporte de Inventario Actual - PARADISO',
            'CUENTAS': 'Reporte de Cuentas por Pagar - PARADISO',
            'DESPACHOS': 'Historial de Despachos - PARADISO'
        };
        const asunto = subjectMap[reportType] || 'Reporte del Sistema Logístico';
        try {
            await this.transporter.sendMail({
                from: `"PARADISO Enclave PDF" <${process.env.MAIL_USER}>`,
                to: email,
                subject: asunto,
                text: `A continuación se adjunta el informe renderizado directamente desde el engranaje del Backend Node.js para: ${reportType}.`,
                attachments: [
                    {
                        filename: `Reporte_${reportType}_${new Date().getTime()}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });
            const usr = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
            await this.correoRepo.save({
                Destinatario: email, Asunto: asunto, TipoReporte: reportType,
                FechaEnvio: new Date(), ID_Empleado: usr?.ID_Empleado || 1
            });
            return { success: true, message: `Correo de Auditoría emitido satisfactoriamente hacia ${email}.` };
        }
        catch (error) {
            console.error('Error enviando correo:', error.message);
            return { success: false, message: 'Correo no enviado: error SMTP. El resto de la operación continúa.' };
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(correo_enviado_entity_1.CorreoEnviado)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MailService);
//# sourceMappingURL=mail.service.js.map