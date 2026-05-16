import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
// @ts-ignore
import PDFDocument from 'pdfkit-table';

import { CorreoEnviado } from './entities/correo-enviado.entity';
import { ConfiguracionCorreo } from './entities/configuracion-correo.entity';
import { Usuario } from '../auth/entities/usuario.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(CorreoEnviado) private correoRepo: Repository<CorreoEnviado>,
    @InjectRepository(ConfiguracionCorreo) private configRepo: Repository<ConfiguracionCorreo>,
    @InjectRepository(Usuario) private usrRepo: Repository<Usuario>,
    private configService: ConfigService,
  ) {}

  // Resuelve la config SMTP: env vars tienen prioridad sobre la BD
  private async resolveSmtpConfig() {
    const envHost = this.configService.get<string>('MAIL_HOST');
    if (envHost) {
      return {
        host: envHost,
        port: Number(this.configService.get<string>('MAIL_PORT') || 587),
        user: this.configService.get<string>('MAIL_USERNAME') || this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD') || this.configService.get<string>('MAIL_PASS'),
        fromEnv: true,
      };
    }
    const cfg = await this.configRepo.findOne({ where: {} });
    if (!cfg?.Host) return null;
    return {
      host: cfg.Host,
      port: cfg.Port || 25,
      user: cfg.Usuario,
      pass: cfg.Password,
      fromEnv: false,
    };
  }

  async getConfig(): Promise<ConfiguracionCorreo | null> {
    return this.configRepo.findOne({ where: {} });
  }

  async getActiveConfig() {
    const smtp = await this.resolveSmtpConfig();
    return {
      host: smtp?.host || '',
      port: smtp?.port || 25,
      usuario: smtp?.user || '',
      passwordSet: !!(smtp?.pass),
      fromEnv: smtp?.fromEnv || false,
    };
  }

  async saveConfig(dto: { host: string; port: number; usuario: string; password: string }): Promise<ConfiguracionCorreo> {
    let cfg = await this.configRepo.findOne({ where: {} });
    if (!cfg) cfg = this.configRepo.create();
    cfg.Host = dto.host;
    cfg.Port = dto.port;
    cfg.Usuario = dto.usuario;
    if (dto.password) cfg.Password = dto.password;
    return this.configRepo.save(cfg);
  }

  private async buildTransporter(): Promise<nodemailer.Transporter> {
    const smtp = await this.resolveSmtpConfig();
    if (!smtp) {
      throw new BadRequestException(
        'Servidor de correo no configurado. Define MAIL_HOST en las variables de entorno o ve a Inteligencia de Negocios → Correo.',
      );
    }

    const transportOptions: any = {
      host: smtp.host,
      port: smtp.port,
      secure: false,
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout:   15000,
      socketTimeout:    120000,
      logger: true,
      debug: true,
    };

    if (smtp.user && smtp.pass) {
      transportOptions.auth = { user: smtp.user, pass: smtp.pass };
    }

    return nodemailer.createTransport(transportOptions);
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    try {
      const transporter = await this.buildTransporter();
      await transporter.verify();
      return { ok: true, message: 'Conexión SMTP establecida correctamente con el servidor privado.' };
    } catch (err: any) {
      const msg: string = err.message || '';
      let hint = msg;
      if (msg.includes('Greeting never received'))
        hint = 'Sin saludo SMTP (Greeting never received). Posibles causas: (1) el servidor de correo no está activo; (2) el puerto 25 está bloqueado por firewall; (3) el servidor tardó demasiado — reintenta.';
      else if (msg.includes('ECONNREFUSED'))
        hint = 'Conexión rechazada (ECONNREFUSED) — verifica que el servidor SMTP esté activo y el puerto sea accesible.';
      else if (msg.includes('ETIMEDOUT') || msg.includes('timeout'))
        hint = 'Timeout de conexión — el servidor no respondió a tiempo. Verifica conectividad y que el puerto 25 esté abierto en el VPS.';
      else if (msg.includes('535') || msg.includes('Authentication'))
        hint = `Autenticación SMTP rechazada — verifica usuario y contraseña. Detalle: ${msg}`;
      return { ok: false, message: hint };
    }
  }

  async buildPdfInventario(productos: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Reporte de Inventario Actual (Métricas Constelacionales)', { align: 'center' }).moveDown();

      const table = {
        title: 'Existencias Globales (Riesgo < 10 Unidades)',
        headers: ['Código/ID', 'Producto', 'Stock Actual', 'Precio Vta', 'Valor Almacenado'],
        rows: productos.map((p) => [
          (p.codigo || p.id).toString(),
          p.nombre,
          p.stock.toString(),
          `Bs. ${p.precio}`,
          `Bs. ${(parseFloat(p.stock) * parseFloat(p.precio)).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: (row: any) => {
          if (parseFloat(row[2]) < 10) {
            doc.font('Helvetica-Bold').fillColor('red');
          } else {
            doc.font('Helvetica').fillColor('black');
          }
          doc.fontSize(10);
          return doc;
        },
      });

      doc.end();
    });
  }

  async buildPdfCuentas(deudas: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO FINANCES', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Estado de Cuentas por Pagar (Proveedores / Cuotas)', { align: 'center' }).moveDown();

      const table = {
        title: 'Facturas en Estado PENDIENTE',
        headers: ['Prov (NIT)', 'Compra_Ref', 'Cuota N°', 'Monto Cuota', 'Expiración'],
        rows: deudas.map((d) => [
          `${d.proveedor} (${d.nit})`,
          d.compra.toString(),
          d.cuota.toString(),
          `Bs. ${d.monto}`,
          new Date(d.fecha).toLocaleDateString(),
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(10),
      });
      doc.end();
    });
  }

  async buildPdfDespachos(despachos: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Historial Base de Despachos Terrestres', { align: 'center' }).moveDown();

      const table = {
        title: 'Bitácora Terrestre y Rastreo de Flotas',
        headers: ['DSP_ID', 'Fecha Salida', 'Camión Placa', 'Sucursal Destino', 'Estado de Envio'],
        rows: despachos.map((d) => [
          d.id.toString(),
          new Date(d.fecha).toLocaleDateString(),
          d.camion,
          d.destino,
          d.estado,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(10),
      });
      doc.end();
    });
  }

  async buildPdfCompras(compras: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO FINANCES', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Historial de Órdenes de Compra', { align: 'center' }).moveDown();

      const table = {
        title: 'Compras Registradas',
        headers: ['Compra_ID', 'Fecha', 'Proveedor', 'Condición', 'Monto Total', 'Estado'],
        rows: compras.map((c) => [
          c.id.toString(),
          c.fecha ? new Date(c.fecha).toLocaleDateString() : '—',
          c.proveedor || '—',
          c.condicion || '—',
          `Bs. ${parseFloat(c.monto || 0).toFixed(2)}`,
          c.estado || '—',
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(9),
      });
      doc.end();
    });
  }

  async buildPdfProveedores(proveedores: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO FINANCES', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Directorio de Proveedores Registrados', { align: 'center' }).moveDown();

      const table = {
        title: 'Proveedores Activos',
        headers: ['ID', 'Razón Social', 'NIT', 'Teléfono', 'Estado'],
        rows: proveedores.map((p) => [
          p.id.toString(),
          p.nombre || '—',
          p.nit || '—',
          p.telefono || '—',
          p.estado || '—',
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(9),
      });
      doc.end();
    });
  }

  async buildPdfMermas(rows: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Reporte de Mermas y Pérdidas de Inventario', { align: 'center' }).moveDown();

      const table = {
        title: 'Detalle de Mermas Registradas',
        headers: ['Fecha', 'Motivo', 'Producto', 'Cantidad', 'Pérdida (Bs.)'],
        rows: rows.map((r) => [
          new Date(r.fecha).toLocaleDateString(),
          r.motivo || '—',
          r.producto,
          r.cantidad.toString(),
          `Bs. ${(parseFloat(r.cantidad) * parseFloat(r.precio || 0)).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(10),
      });
      doc.end();
    });
  }

  async buildPdfIngresos(rows: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Reporte de Ingresos de Inventario', { align: 'center' }).moveDown();

      const table = {
        title: 'Notas de Ingreso Registradas',
        headers: ['Nota', 'Fecha', 'Proveedor', 'Producto', 'Cantidad', 'Valor (Bs.)'],
        rows: rows.map((r) => [
          `INC-${String(r.id).padStart(5, '0')}`,
          new Date(r.fecha).toLocaleDateString(),
          r.proveedor || '—',
          r.producto,
          r.cantidad.toString(),
          `Bs. ${(parseFloat(r.cantidad) * parseFloat(r.precio || 0)).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(9),
      });
      doc.end();
    });
  }

  async buildPdfEgresos(rows: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('PARADISO LOGISTICS', { align: 'center' }).moveDown();
      doc.fontSize(14).text('Reporte de Egresos de Inventario', { align: 'center' }).moveDown();

      const table = {
        title: 'Notas de Egreso Registradas',
        headers: ['Nota', 'Fecha', 'Producto', 'Cantidad', 'Sucursal Destino', 'Valor (Bs.)'],
        rows: rows.map((r) => [
          `EGR-${String(r.id).padStart(5, '0')}`,
          new Date(r.fecha).toLocaleDateString(),
          r.producto,
          r.cantidad.toString(),
          r.sucursal || '—',
          `Bs. ${(parseFloat(r.cantidad) * parseFloat(r.precio || 0)).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: () => doc.font('Helvetica').fillColor('black').fontSize(9),
      });
      doc.end();
    });
  }

  async sendReport(
    userId: number,
    email: string,
    reportType: string,
    pdfBuffer: Buffer,
    mensajePersonalizado?: string,
  ) {
    const subjectMap: any = {
      INVENTARIO:  'Reporte de Inventario Actual - PARADISO',
      CUENTAS:     'Reporte de Cuentas por Pagar - PARADISO',
      DESPACHOS:   'Historial de Despachos - PARADISO',
      COMPRAS:     'Historial de Órdenes de Compra - PARADISO',
      PROVEEDORES: 'Directorio de Proveedores - PARADISO',
      MERMAS:      'Reporte de Mermas y Pérdidas - PARADISO',
      INGRESOS:    'Reporte de Ingresos de Inventario - PARADISO',
      EGRESOS:     'Reporte de Egresos de Inventario - PARADISO',
    };

    const asunto = subjectMap[reportType] || 'Reporte del Sistema Logístico';
    const cuerpo = mensajePersonalizado?.trim()
      ? mensajePersonalizado.trim()
      : `A continuación se adjunta el informe renderizado directamente desde el engranaje del Backend Node.js para: ${reportType}.`;

    const smtp = await this.resolveSmtpConfig();
    const remitente =
      this.configService.get<string>('MAIL_FROM_ADDRESS') ||
      smtp?.user ||
      'noreply@paradiso.local';

    const transporter = await this.buildTransporter();

    try {
      await transporter.sendMail({
        from: `"PARADISO Enclave PDF" <${remitente}>`,
        to: email,
        subject: asunto,
        text: cuerpo,
        attachments: [
          {
            filename: `Reporte_${reportType}_${Date.now()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      const usr = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
      await this.correoRepo.save({
        Destinatario: email,
        Asunto: asunto,
        TipoReporte: reportType,
        FechaEnvio: new Date(),
        ID_Empleado: usr?.ID_Empleado || 1,
      });

      return { success: true, message: `Correo enviado satisfactoriamente a ${email}.` };
    } catch (error) {
      console.error('Error enviando correo:', error.message);
      throw new BadRequestException(`Error SMTP al enviar el correo: ${error.message}`);
    }
  }
}
