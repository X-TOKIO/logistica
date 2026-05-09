import { PaymentsService } from './payments.service';
export declare class PaymentsWebhookController {
    private readonly srv;
    constructor(srv: PaymentsService);
    webhookMacrodroidQR(body: {
        idCuenta: number;
        montoPagado: number;
        referencia: string;
    }): Promise<import("./entities/pago.entity").Pago>;
    webhookLibelulaAlive(): {
        status: string;
        method: string;
        path: string;
    };
    webhookLibelulaQR(req: any, body: any): Promise<{
        ok: boolean;
    }>;
}
