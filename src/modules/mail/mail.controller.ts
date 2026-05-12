import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../warehouse/entities/producto.entity';
import { PlanPago } from '../payments/entities/plan-pago.entity';
import { Despacho } from '../logistics/entities/despacho.entity';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_REPORTES')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailSrv: MailService,
    @InjectRepository(Producto) private prodRepo: Repository<Producto>,
    @InjectRepository(PlanPago) private planRepo: Repository<PlanPago>,
    @InjectRepository(Despacho) private despRepo: Repository<Despacho>,
  ) {}

  // ── Configuración SMTP ───────────────────────────────────────────────────────

  @Get('config')
  async getConfig() {
    const cfg = await this.mailSrv.getConfig();
    if (!cfg) return { host: '', port: 25565, usuario: '', passwordSet: false };
    return {
      host: cfg.Host,
      port: cfg.Port,
      usuario: cfg.Usuario,
      passwordSet: !!cfg.Password,
    };
  }

  @Post('config')
  async saveConfig(
    @Body() body: { host: string; port: number; usuario: string; password?: string },
  ) {
    if (!body.host || !body.usuario) {
      throw new BadRequestException('Host y Usuario son obligatorios.');
    }
    await this.mailSrv.saveConfig({
      host: body.host,
      port: body.port || 25565,
      usuario: body.usuario,
      password: body.password || '',
    });
    return { success: true, message: 'Configuración SMTP guardada correctamente.' };
  }

  @Post('config/test')
  async testConfig() {
    return this.mailSrv.testConnection();
  }

  // ── Envío de Reportes ────────────────────────────────────────────────────────

  @Post('reportes/enviar')
  async enviarResumenPdf(
    @Req() req: any,
    @Body() body: { reportType: string; email: string; mensajePersonalizado?: string },
  ) {
    if (!body.email) throw new BadRequestException('Dirección de email destinataria no provista.');

    let pdfBuffer: Buffer;

    if (body.reportType === 'INVENTARIO') {
      const rows = await this.prodRepo.manager.query(`
        SELECT p."ID_Producto" as id, p."CodigoBarra" as codigo, p."Nombre" as nombre,
               p."PrecioUnitario" as precio, COALESCE(SUM(pa."Stock_Actual"), 0) as stock
        FROM "Producto" p
        LEFT JOIN "ProductoAlmacen" pa ON pa."ID_Producto" = p."ID_Producto"
        GROUP BY p."ID_Producto"
      `);
      pdfBuffer = await this.mailSrv.buildPdfInventario(rows);
    } else if (body.reportType === 'CUENTAS') {
      const rows = await this.planRepo.createQueryBuilder('pp')
        .leftJoinAndSelect('pp.pago', 'p')
        .leftJoinAndSelect('p.notaCompra', 'nc')
        .leftJoinAndSelect('nc.proveedor', 'prov')
        .where('pp.Estado = :est', { est: 'PENDIENTE' })
        .getMany();

      const mapped = rows.map((r) => ({
        proveedor: r.pago.notaCompra.proveedor.Nombre_RazonSocial,
        nit: r.pago.notaCompra.proveedor.NIT,
        compra: r.pago.notaCompra.ID_Compra,
        cuota: r.ID_Cuota,
        monto: r.Monto,
        fecha: r.Fecha,
      }));
      pdfBuffer = await this.mailSrv.buildPdfCuentas(mapped);
    } else if (body.reportType === 'DESPACHOS') {
      const joinedRows = await this.despRepo.manager.query(`
        SELECT d."ID_Despacho" as id, d."FechaSalida" as fecha, c."Placa" as camion,
               s."Nombre" as destino, dc."EstadoDeEnvio" as estado
        FROM "Despacho" d
        JOIN "despacho_camion" dc ON dc."ID_Despacho" = d."ID_Despacho"
        JOIN "Camion" c ON c."ID_Camion" = dc."ID_Camion"
        JOIN "Ruta" r ON r."ID_Ruta" = d."ID_Ruta"
        JOIN "Sucursal" s ON s."ID_Sucursal" = r."ID_Sucursal"
      `);
      pdfBuffer = await this.mailSrv.buildPdfDespachos(joinedRows);
    } else {
      throw new BadRequestException('Tipo de Reporte Solicitado es Inválido.');
    }

    return this.mailSrv.sendReport(
      req.user.sub,
      body.email,
      body.reportType,
      pdfBuffer,
      body.mensajePersonalizado,
    );
  }
}
