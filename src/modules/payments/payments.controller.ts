import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { CreateCompraDto, RegistrarPagoDto } from './payments.service';
import { LibelulaService } from './libelula.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_FINANZAS')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly srv: PaymentsService,
    private readonly libelula: LibelulaService,
  ) { }

  // ── Compras ───────────────────────────────────────────────────────────────

  @RequirePermissions('MODULO_FINANZAS', 'MODULO_REPORTES', 'MODULO_INVENTARIO')
  @Get('compras')
  getCompras() { return this.srv.getCompras(); }

  @RequirePermissions('MODULO_FINANZAS', 'MODULO_INVENTARIO')
  @Get('compras/:id/status')
  getCompraStatus(@Param('id') id: string) { return this.srv.getCompraStatus(Number(id)); }

  @RequirePermissions('MODULO_FINANZAS', 'MODULO_INVENTARIO')
  @Get('compras/:id')
  getCompraById(@Param('id') id: string) { return this.srv.getCompraById(Number(id)); }

  @Post('compras')
  createCompra(@Request() req: any, @Body() dto: CreateCompraDto) {
    return this.srv.createCompra(dto, req.user.userId);
  }

  @Patch('compras/:id/anular')
  anularCompra(@Param('id') id: string) { return this.srv.anularCompra(Number(id)); }

  // ── Libélula QR Real ──────────────────────────────────────────────────────

  @Post('generar-qr')
  async generarQRLibelula(
    @Body() dto: { monto: number; glosa?: string; email?: string; idCompra?: number },
  ) {
    let idTransaccion: string;
    let cachedQrUrl: string | null = null;
    let cachedIdLibelula: string | null = null;

    if (dto.idCompra) {
      const ref = await this.srv.obtenerOCrearTransaccionLibelula(dto.idCompra);
      idTransaccion = ref.idTransaccion;
      cachedQrUrl = ref.qrUrl;
      cachedIdLibelula = ref.idLibelula;
    } else {
      idTransaccion = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    }

    // Si la URL del QR ya fue generada antes, la devuelve directamente sin volver a llamar a Libélula
    if (cachedQrUrl) {
      return { idTransaccion, qrUrl: cachedQrUrl };
    }

    const result = await this.libelula.generarPagoQR({
      monto: dto.monto,
      glosa: dto.glosa ?? 'Pago PARADISO',
      idTransaccion,
      email: dto.email,
    });

    // Persiste URL, UUID y código de recaudación para futuras consultas
    const qrUrlToSave = result.qrUrl ?? result.pasarelaUrl;
    if (dto.idCompra && (qrUrlToSave || result.idLibelula || result.codigoRecaudacion)) {
      await this.srv.guardarQrUrl(dto.idCompra, qrUrlToSave ?? '', result.idLibelula, result.codigoRecaudacion);
    }

    return result;
  }

  /** Consulta directa a Libélula por si el webhook no llegó — vía manual desde el modal */
  @Get('compras/:id/verificar-pago')
  async verificarPagoLibelula(@Param('id') id: string) {
    const idCompra = Number(id);
    const compra = await this.srv.getCompraById(idCompra);

    if (!compra) throw new Error(`Compra #${idCompra} no encontrada.`);

    if (compra.Estado_Documento === 'ACTIVO') {
      return { confirmado: true, mensaje: 'El pago ya fue confirmado.' };
    }

    const refLibelula   = (compra as any).Ref_Libelula        as string | null;
    const idLibelula    = (compra as any).Id_Libelula          as string | null;
    const codRecaudacion = (compra as any).Codigo_Recaudacion  as string | null;
    const refsPrevias: string[] = JSON.parse((compra as any).Refs_Previas ?? '[]');

    // ── Intento 1: UUID + código de recaudación (los identificadores que Libélula reconoce) ──
    if (idLibelula || codRecaudacion) {
      const resultado = await this.libelula.consultarDeuda({
        idTransaccion:      idLibelula      ?? undefined,
        codigoRecaudacion:  codRecaudacion  ?? undefined,
        identificadorDeuda: refLibelula     ?? undefined,
      });
      if (resultado.pagado) {
        await this.srv.confirmarPagoQR(idCompra);
        return { confirmado: true, mensaje: 'Pago verificado y compra activada.' };
      }
    }

    // ── Intento 2: sólo con el PAY-... actual (caso sin UUID guardado) ──
    if (refLibelula && !idLibelula && !codRecaudacion) {
      const resultado = await this.libelula.consultarDeuda({ identificadorDeuda: refLibelula });
      if (resultado.pagado) {
        await this.srv.confirmarPagoQR(idCompra);
        return { confirmado: true, mensaje: 'Pago verificado con identificador_deuda.' };
      }
    }

    // ── Intento 3: refs históricas (doble disparo) ──
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

  /**
   * Override retroactivo: permite fijar manualmente el id_transaccion (UUID) y/o
   * codigo_recaudacion de Libélula para compras históricas (#28, #29, #30).
   * Tras llamar a este endpoint, vuelve a llamar a GET verificar-pago.
   */
  @Patch('compras/:id/libelula-ids')
  @HttpCode(200)
  setLibelulaIds(
    @Param('id') id: string,
    @Body() dto: { idTransaccion?: string; codigoRecaudacion?: string },
  ) {
    return this.srv.actualizarIdsLibelula(Number(id), dto);
  }

  // ── Pasarela QR Sandbox ───────────────────────────────────────────────────

  @Get('qr/generate/:idCompra')
  generateQR(@Param('idCompra') id: string) { return this.srv.generateQR(Number(id)); }

  @Get('qr/payment-ref/:idCuenta')
  generateQRPaymentRef(@Param('idCuenta') id: string) {
    return this.srv.generateQRPaymentRef(Number(id));
  }

  @Post('webhook/cxp-confirm')
  webhookQRConfirm(@Body() dto: { transactionToken: string; externalRef: string; montoPagado: number }) {
    return this.srv.webhookQRConfirm(dto);
  }

  @Post('webhook/qr-confirm/:idCompra')
  confirmarPagoQR(@Param('idCompra') id: string) { return this.srv.confirmarPagoQR(Number(id)); }

  // ── CuentaPorPagar ────────────────────────────────────────────────────────

  @Get('cuentas-por-pagar')
  getCuentasPorPagar() { return this.srv.getCuentasPorPagar(); }

  @Get('cuentas-por-pagar/alertas')
  getAlertasCxP() { return this.srv.getAlertasCxP(); }

  @Get('cuentas-por-pagar/:id')
  getCuentaPorPagarById(@Param('id') id: string) {
    return this.srv.getCuentaPorPagarById(Number(id));
  }

  @Get('cuentas-por-pagar/:id/pagos')
  getHistorialPagos(@Param('id') id: string) {
    return this.srv.getHistorialPagosCuenta(Number(id));
  }

  @Get('cuentas-por-pagar/:id/polling')
  pollingCxP(@Param('id') id: string) {
    return this.srv.pollingCxP(Number(id));
  }

  @Get('cuentas-por-pagar/:id/cuotas')
  getCuotasCuenta(@Param('id') id: string) { return this.srv.getCuotasCuenta(Number(id)); }

  @Patch('cuentas-por-pagar/:id/pagar')
  marcarCuentaPagada(@Param('id') id: string) { return this.srv.marcarCuentaPagada(Number(id)); }

  // ── Registro de Pagos ────────────────────────────────────────────────────

  @Post('pagos')
  registrarPago(@Request() req: any, @Body() dto: RegistrarPagoDto) {
    return this.srv.registrarPago(dto, req.user.userId);
  }

  // ── Legado ───────────────────────────────────────────────────────────────

  @Get('cuentas')
  getCuentasLegado() { return this.srv.getCuentasPorPagarLegado(); }

  @Post('pagar/:idPago/:idCuota')
  pagarCuota(@Param('idPago') idPago: string, @Param('idCuota') idCuota: string) {
    return this.srv.marcarPago(Number(idPago), Number(idCuota));
  }

  // ── Proveedores ──────────────────────────────────────────────────────────

  @Get('proveedores')
  getProveedores() { return this.srv.getProveedores(); }

  // ── Estadísticas ─────────────────────────────────────────────────────────

  @RequirePermissions('MODULO_FINANZAS', 'MODULO_REPORTES')
  @Get('estadisticas/finanzas')
  getEstadisticasFinanzas() { return this.srv.getEstadisticasFinanzas(); }

  @RequirePermissions('MODULO_FINANZAS', 'MODULO_REPORTES')
  @Get('estadisticas')
  getEstadisticas() { return this.srv.getEstadisticas(); }
}
