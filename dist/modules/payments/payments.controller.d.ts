import { PaymentsService } from './payments.service';
import type { CreateCompraDto, RegistrarPagoDto } from './payments.service';
import { LibelulaService } from './libelula.service';
export declare class PaymentsController {
    private readonly srv;
    private readonly libelula;
    constructor(srv: PaymentsService, libelula: LibelulaService);
    getCompras(): Promise<import("./entities/nota-compra.entity").NotaCompra[]>;
    getCompraStatus(id: string): Promise<{
        Estado_Documento: string;
    }>;
    getCompraById(id: string): Promise<{
        cuentasPorPagar: import("./entities/cuenta-por-pagar.entity").CuentaPorPagar[];
        ID_Compra: number;
        Fecha_Emision: Date;
        Hora_Emision: string;
        ID_Almacen: number;
        almacen: import("../warehouse/entities/almacen.entity").Almacen;
        Costo_Envio: number;
        Monto_Total: number;
        Estado_Documento: string;
        Condicion_Pago: string;
        Nro_Factura: string;
        Ref_Libelula: string | null;
        Id_Libelula: string | null;
        Codigo_Recaudacion: string | null;
        Refs_Previas: string | null;
        Qr_Url: string | null;
        ID_Proveedor: number;
        ID_Empleado: number;
        proveedor: import("./entities/proveedor.entity").Proveedor;
        empleado: import("../auth/entities/empleado.entity").Empleado;
        detalles: import("./entities/detalle-compra.entity").DetalleCompra[];
        deleted_at: Date;
    } | null>;
    createCompra(req: any, dto: CreateCompraDto): Promise<import("./entities/nota-compra.entity").NotaCompra | null>;
    anularCompra(id: string): Promise<import("./entities/nota-compra.entity").NotaCompra>;
    generarQRLibelula(dto: {
        monto: number;
        glosa?: string;
        email?: string;
        idCompra?: number;
    }): Promise<import("./libelula.service").QRResponse>;
    verificarPagoLibelula(id: string): Promise<{
        confirmado: boolean;
        mensaje: string;
    }>;
    setLibelulaIds(id: string, dto: {
        idTransaccion?: string;
        codigoRecaudacion?: string;
    }): Promise<void>;
    generateQR(id: string): Promise<{
        qrUrl: string;
    }>;
    generateQRPaymentRef(id: string): Promise<{
        externalRef: string;
    }>;
    webhookQRConfirm(dto: {
        transactionToken: string;
        externalRef: string;
        montoPagado: number;
    }): Promise<import("./entities/pago.entity").Pago>;
    confirmarPagoQR(id: string): Promise<{
        message: string;
    }>;
    getCuentasPorPagar(): Promise<import("./entities/cuenta-por-pagar.entity").CuentaPorPagar[]>;
    getAlertasCxP(): Promise<{
        vencidas: import("./entities/cuenta-por-pagar.entity").CuentaPorPagar[];
        proximas: import("./entities/cuenta-por-pagar.entity").CuentaPorPagar[];
        cuotasVencidas: import("./entities/cuota-cxp.entity").CuotaCxP[];
        cuotasProximas: import("./entities/cuota-cxp.entity").CuotaCxP[];
    }>;
    getCuentaPorPagarById(id: string): Promise<import("./entities/cuenta-por-pagar.entity").CuentaPorPagar>;
    getHistorialPagos(id: string): Promise<import("./entities/pago.entity").Pago[]>;
    pollingCxP(id: string): Promise<{
        Saldo_Pendiente: number;
        Estado_Pago: string;
    }>;
    getCuotasCuenta(id: string): Promise<import("./entities/cuota-cxp.entity").CuotaCxP[]>;
    marcarCuentaPagada(id: string): Promise<import("./entities/cuenta-por-pagar.entity").CuentaPorPagar>;
    registrarPago(req: any, dto: RegistrarPagoDto): Promise<import("./entities/pago.entity").Pago>;
    getCuentasLegado(): Promise<import("./entities/plan-pago.entity").PlanPago[]>;
    pagarCuota(idPago: string, idCuota: string): Promise<import("./entities/plan-pago.entity").PlanPago>;
    getProveedores(): Promise<import("./entities/proveedor.entity").Proveedor[]>;
    getEstadisticas(): Promise<{
        deudaLiquida: number;
        capitalInmovilizado: number;
        pieData: any;
        barData: any;
    }>;
}
