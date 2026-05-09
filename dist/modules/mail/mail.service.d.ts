import { Repository } from 'typeorm';
import { CorreoEnviado } from './entities/correo-enviado.entity';
import { Usuario } from '../auth/entities/usuario.entity';
export declare class MailService {
    private correoRepo;
    private usrRepo;
    private transporter;
    constructor(correoRepo: Repository<CorreoEnviado>, usrRepo: Repository<Usuario>);
    buildPdfInventario(productos: any[]): Promise<Buffer>;
    buildPdfCuentas(deudas: any[]): Promise<Buffer>;
    buildPdfDespachos(despachos: any[]): Promise<Buffer>;
    sendReport(userId: number, email: string, reportType: string, pdfBuffer: Buffer): Promise<{
        success: boolean;
        message: string;
    }>;
}
