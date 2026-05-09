import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { NotaCompra } from './entities/nota-compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CuentaPorPagar } from './entities/cuenta-por-pagar.entity';
import { CuotaCxP } from './entities/cuota-cxp.entity';
import { Proveedor } from './entities/proveedor.entity';
import { Pago } from './entities/pago.entity';
import { PlanPago } from './entities/plan-pago.entity';
import { Producto } from '../warehouse/entities/producto.entity';
import { Usuario } from '../auth/entities/usuario.entity';
export interface CreateDetalleDto {
    ID_Producto: number;
    Cantidad: number;
    Precio_Unitario: number;
    Fecha_Elaboracion?: string;
    Fecha_Vencimiento?: string;
}
export interface CuotaDto {
    Fecha_Vencimiento: string;
}
export interface CreateCompraDto {
    Fecha_Emision: string;
    Hora_Emision?: string;
    ID_Almacen?: number;
    Costo_Envio?: number;
    ID_Proveedor: number;
    Condicion_Pago: 'CONTADO' | 'CREDITO';
    Nro_Factura?: string;
    Metodo_Pago?: 'EFECTIVO' | 'QR';
    cuotas?: CuotaDto[];
    detalles: CreateDetalleDto[];
}
export interface RegistrarPagoDto {
    ID_Cuenta: number;
    Monto_Pagado: number;
    Fecha_Pago: string;
    Metodo_Pago: 'EFECTIVO' | 'QR';
    Referencia_Comprobante?: string;
    Observaciones?: string;
    ID_CuotaCxP?: number;
}
export declare class PaymentsService implements OnApplicationBootstrap {
    private notaRepo;
    private detalleRepo;
    private cuentaRepo;
    private cuotaRepo;
    private provRepo;
    private pagoRepo;
    private planRepo;
    private productoRepo;
    private usrRepo;
    private readonly dataSource;
    private readonly logger;
    private readonly pendingQRRefs;
    private readonly pendingLibelulaCompras;
    constructor(notaRepo: Repository<NotaCompra>, detalleRepo: Repository<DetalleCompra>, cuentaRepo: Repository<CuentaPorPagar>, cuotaRepo: Repository<CuotaCxP>, provRepo: Repository<Proveedor>, pagoRepo: Repository<Pago>, planRepo: Repository<PlanPago>, productoRepo: Repository<Producto>, usrRepo: Repository<Usuario>, dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    getCompras(): Promise<NotaCompra[]>;
    getCompraById(id: number): Promise<{
        cuentasPorPagar: CuentaPorPagar[];
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
        proveedor: Proveedor;
        empleado: import("../auth/entities/empleado.entity").Empleado;
        detalles: DetalleCompra[];
        deleted_at: Date;
    } | null>;
    getCompraStatus(id: number): Promise<{
        Estado_Documento: string;
    }>;
    createCompra(dto: CreateCompraDto, userId: number): Promise<NotaCompra | null>;
    anularCompra(id: number): Promise<NotaCompra>;
    generateQR(idCompra: number): Promise<{
        qrUrl: string;
    }>;
    confirmarPagoQR(idCompra: number): Promise<{
        message: string;
    }>;
    confirmQrPayment(body: {
        idCuenta: number;
        montoPagado: number;
        referencia: string;
    }): Promise<Pago>;
    getCuentasPorPagar(): Promise<CuentaPorPagar[]>;
    getAlertasCxP(): Promise<{
        vencidas: CuentaPorPagar[];
        proximas: CuentaPorPagar[];
        cuotasVencidas: CuotaCxP[];
        cuotasProximas: CuotaCxP[];
    }>;
    marcarCuentaPagada(id: number): Promise<CuentaPorPagar>;
    registrarPago(dto: RegistrarPagoDto, userId: number): Promise<Pago>;
    getHistorialPagosCuenta(id: number): Promise<Pago[]>;
    getCuentaPorPagarById(id: number): Promise<CuentaPorPagar>;
    pollingCxP(id: number): Promise<{
        Saldo_Pendiente: number;
        Estado_Pago: string;
    }>;
    getCuotasCuenta(idCuenta: number): Promise<CuotaCxP[]>;
    generateQRPaymentRef(idCuenta: number): Promise<{
        externalRef: string;
    }>;
    webhookQRConfirm(dto: {
        transactionToken: string;
        externalRef: string;
        montoPagado: number;
    }): Promise<Pago>;
    obtenerOCrearTransaccionLibelula(idCompra: number): Promise<{
        idTransaccion: string;
        qrUrl: string | null;
        idLibelula: string | null;
        codigoRecaudacion: string | null;
    }>;
    guardarQrUrl(idCompra: number, qrUrl: string, idLibelula?: string, codigoRecaudacion?: string): Promise<void>;
    actualizarIdsLibelula(idCompra: number, dto: {
        idTransaccion?: string;
        codigoRecaudacion?: string;
    }): Promise<void>;
    webhookLibelulaConfirm(body: any): Promise<{
        ok: boolean;
    }>;
    getProveedores(): Promise<Proveedor[]>;
    getCuentasPorPagarLegado(): Promise<PlanPago[]>;
    marcarPago(pagoId: number, cuotaId: number): Promise<PlanPago>;
    getEstadisticas(): Promise<{
        deudaLiquida: number;
        capitalInmovilizado: number;
        pieData: any;
        barData: any;
    }>;
}
