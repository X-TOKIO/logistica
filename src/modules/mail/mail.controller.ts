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
import { NotaCompra } from '../payments/entities/nota-compra.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_REPORTES')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailSrv: MailService,
    @InjectRepository(Producto)   private prodRepo:     Repository<Producto>,
    @InjectRepository(PlanPago)   private planRepo:     Repository<PlanPago>,
    @InjectRepository(Despacho)   private despRepo:     Repository<Despacho>,
    @InjectRepository(NotaCompra) private compraRepo:   Repository<NotaCompra>,
    @InjectRepository(Proveedor)  private provRepo:     Repository<Proveedor>,
  ) {}

  // ── Configuración SMTP ───────────────────────────────────────────────────────

  @Get('config')
  async getConfig() {
    return this.mailSrv.getActiveConfig();
  }

  @Post('config')
  async saveConfig(
    @Body() body: { host: string; port: number; usuario: string; password?: string },
  ) {
    if (!body.host) {
      throw new BadRequestException('El Host SMTP es obligatorio.');
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
    } else if (body.reportType === 'COMPRAS') {
      const rows = await this.compraRepo.manager.query(`
        SELECT nc."ID_Compra" as id, nc."Fecha_Emision" as fecha,
               prov."Nombre_RazonSocial" as proveedor,
               nc."Condicion_Pago" as condicion,
               nc."Monto_Total" as monto,
               nc."Estado_Documento" as estado
        FROM "NotaCompra" nc
        LEFT JOIN "Proveedor" prov ON prov."ID_Proveedor" = nc."ID_Proveedor"
        ORDER BY nc."Fecha_Emision" DESC
        LIMIT 200
      `);
      pdfBuffer = await this.mailSrv.buildPdfCompras(rows);
    } else if (body.reportType === 'PROVEEDORES') {
      const rows = await this.provRepo.manager.query(`
        SELECT "ID_Proveedor" as id, "Nombre_RazonSocial" as nombre,
               "NIT" as nit, "Telefono" as telefono, "Estado" as estado
        FROM "Proveedor"
        ORDER BY "Nombre_RazonSocial"
      `);
      pdfBuffer = await this.mailSrv.buildPdfProveedores(rows);
    } else if (body.reportType === 'MERMAS') {
      const rows = await this.prodRepo.manager.query(`
        SELECT m."ID_Merma" as id, m."Fecha" as fecha, m."MotivoPerdida" as motivo,
               p."Nombre" as producto, dm."Cantidad" as cantidad,
               p."PrecioUnitario" as precio
        FROM "Mermas" m
        JOIN "DetalleMerma" dm ON dm."ID_Merma" = m."ID_Merma"
        JOIN "Producto" p ON p."ID_Producto" = dm."ID_Producto"
        WHERE m.deleted_at IS NULL
        ORDER BY m."Fecha" DESC
        LIMIT 500
      `);
      pdfBuffer = await this.mailSrv.buildPdfMermas(rows);
    } else if (body.reportType === 'INGRESOS') {
      const rows = await this.prodRepo.manager.query(`
        SELECT ni."ID_Ingreso" as id, ni."Fecha" as fecha,
               prov."Nombre_RazonSocial" as proveedor,
               p."Nombre" as producto, di."Cantidad" as cantidad,
               p."PrecioUnitario" as precio
        FROM "NotaIngreso" ni
        JOIN "DetalleIngreso" di ON di."ID_Ingreso" = ni."ID_Ingreso"
        JOIN "Producto" p ON p."ID_Producto" = di."ID_Producto"
        LEFT JOIN "NotaCompra" nc ON nc."ID_Compra" = ni."ID_Compra"
        LEFT JOIN "Proveedor" prov ON prov."ID_Proveedor" = nc."ID_Proveedor"
        WHERE ni.deleted_at IS NULL
        ORDER BY ni."Fecha" DESC
        LIMIT 500
      `);
      pdfBuffer = await this.mailSrv.buildPdfIngresos(rows);
    } else if (body.reportType === 'EGRESOS') {
      const rows = await this.prodRepo.manager.query(`
        SELECT ne."ID_Egreso" as id, ne."Fecha" as fecha,
               p."Nombre" as producto, de."Cantidad" as cantidad,
               p."PrecioUnitario" as precio, s."Nombre" as sucursal
        FROM "NotaEgreso" ne
        JOIN "DetalleEgreso" de ON de."ID_Egreso" = ne."ID_Egreso"
        JOIN "Producto" p ON p."ID_Producto" = de."ID_Producto"
        LEFT JOIN "Sucursal" s ON s."ID_Sucursal" = de."ID_Sucursal"
        WHERE ne.deleted_at IS NULL
        ORDER BY ne."Fecha" DESC
        LIMIT 500
      `);
      pdfBuffer = await this.mailSrv.buildPdfEgresos(rows);
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
