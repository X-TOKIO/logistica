import { Controller, Get, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

// Este controlador es intencionalmente público (sin guards) para recibir
// notificaciones de pasarelas externas (Libélula, Macrodroid) vía ngrok.
@Controller('payments')
export class PaymentsWebhookController {
  constructor(private readonly srv: PaymentsService) { }

  @Post('webhook/macrodroid-qr')
  @HttpCode(HttpStatus.OK)
  webhookMacrodroidQR(
    @Body() body: { idCuenta: number; montoPagado: number; referencia: string },
  ) {
    return this.srv.confirmQrPayment(body);
  }

  /** Permite verificar que el túnel ngrok esté activo abriendo la URL en el navegador */
  @Get('webhook/qr-confirm')
  webhookLibelulaAlive() {
    return { status: 'Webhook endpoint is alive', method: 'POST', path: '/payments/webhook/qr-confirm' };
  }

  @Post('webhook/qr-confirm')
  @HttpCode(HttpStatus.OK)
  webhookLibelulaQR(@Req() req: any, @Body() body: any) {
    console.log('--- NUEVA NOTIFICACIÓN DE LIBÉLULA ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(body, null, 2));
    return this.srv.webhookLibelulaConfirm(body);
  }
}
