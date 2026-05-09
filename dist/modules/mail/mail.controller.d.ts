import { MailService } from './mail.service';
import { Repository } from 'typeorm';
import { Producto } from '../warehouse/entities/producto.entity';
import { PlanPago } from '../payments/entities/plan-pago.entity';
import { Despacho } from '../logistics/entities/despacho.entity';
export declare class MailController {
    private readonly mailSrv;
    private prodRepo;
    private planRepo;
    private despRepo;
    constructor(mailSrv: MailService, prodRepo: Repository<Producto>, planRepo: Repository<PlanPago>, despRepo: Repository<Despacho>);
    enviarResumenPdf(req: any, body: {
        reportType: string;
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
