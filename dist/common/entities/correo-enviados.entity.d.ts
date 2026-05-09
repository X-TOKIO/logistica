import { Empleado } from '../../modules/auth/entities/empleado.entity';
export declare class CorreoEnviados {
    ID_Correo: number;
    Remitente: string;
    Destinatario: string;
    Asunto: string;
    Mensaje: string;
    FechaEnvio: Date;
    Adjunto: string;
    ID_Empleado: number;
    empleado: Empleado;
    deleted_at: Date;
}
