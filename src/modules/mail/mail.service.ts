import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
// @ts-ignore
import PDFDocument from 'pdfkit-table'; 

import { CorreoEnviado } from './entities/correo-enviado.entity';
import { Usuario } from '../auth/entities/usuario.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(CorreoEnviado) private correoRepo: Repository<CorreoEnviado>,
    @InjectRepository(Usuario) private usrRepo: Repository<Usuario>,
  ) {
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

  async buildPdfInventario(productos: any[]): Promise<Buffer> {
     return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffers: any[] = [];
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
            prepareRow: (row: any) => {
                const stockStr = row[2];
                if (parseFloat(stockStr) < 10) {
                    doc.font("Helvetica-Bold").fillColor('red'); 
                } else {
                    doc.font("Helvetica").fillColor('black');
                }
                doc.fontSize(10);
                return doc;
            }
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

  async buildPdfDespachos(despachos: any[]): Promise<Buffer> {
      return new Promise((resolve) => {
          const doc = new PDFDocument({ margin: 30, size: 'A4' });
          const buffers: any[] = [];
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

  async sendReport(userId: number, email: string, reportType: string, pdfBuffer: Buffer) {
      const subjectMap: any = {
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
      } catch (error) {
         console.error('Error enviando correo:', error.message);
         return { success: false, message: 'Correo no enviado: error SMTP. El resto de la operación continúa.' };
      }
  }
}
