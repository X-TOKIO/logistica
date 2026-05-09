import { Empleado } from '../../auth/entities/empleado.entity';
export declare class CorreoEnviado {
    ID_Correo: number;
    Destinatario: string;
    Asunto: string;
    TipoReporte: string;
    FechaEnvio: Date;
    ID_Empleado: number;
    empleado: Empleado;
    deleted_at: Date;
}
