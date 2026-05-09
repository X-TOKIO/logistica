export interface ConsultaDeudaResult {
    pagado: boolean;
    estado: string;
    raw: any;
}
export interface GenerarQRPayload {
    monto: number;
    glosa: string;
    idTransaccion: string;
    email?: string;
}
export interface QRResponse {
    qrUrl?: string;
    pasarelaUrl?: string;
    idTransaccion: string;
    idLibelula?: string;
    codigoRecaudacion?: string;
}
export interface ConsultaParams {
    idTransaccion?: string;
    codigoRecaudacion?: string;
    identificadorDeuda?: string;
}
export declare class LibelulaService {
    private readonly logger;
    private readonly appKey;
    private readonly apiUrl;
    private readonly consultaUrl;
    constructor();
    generarPagoQR(payload: GenerarQRPayload): Promise<QRResponse>;
    consultarDeuda(params: ConsultaParams): Promise<ConsultaDeudaResult>;
}
