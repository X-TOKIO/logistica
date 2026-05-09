"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nota_compra_entity_1 = require("./entities/nota-compra.entity");
const detalle_compra_entity_1 = require("./entities/detalle-compra.entity");
const cuenta_por_pagar_entity_1 = require("./entities/cuenta-por-pagar.entity");
const cuota_cxp_entity_1 = require("./entities/cuota-cxp.entity");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const pago_entity_1 = require("./entities/pago.entity");
const plan_pago_entity_1 = require("./entities/plan-pago.entity");
const producto_entity_1 = require("../warehouse/entities/producto.entity");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
let PaymentsService = class PaymentsService {
    notaRepo;
    detalleRepo;
    cuentaRepo;
    cuotaRepo;
    provRepo;
    pagoRepo;
    planRepo;
    productoRepo;
    usrRepo;
    dataSource;
    logger = new common_1.Logger('PaymentsService');
    pendingQRRefs = new Map();
    pendingLibelulaCompras = new Map();
    constructor(notaRepo, detalleRepo, cuentaRepo, cuotaRepo, provRepo, pagoRepo, planRepo, productoRepo, usrRepo, dataSource) {
        this.notaRepo = notaRepo;
        this.detalleRepo = detalleRepo;
        this.cuentaRepo = cuentaRepo;
        this.cuotaRepo = cuotaRepo;
        this.provRepo = provRepo;
        this.pagoRepo = pagoRepo;
        this.planRepo = planRepo;
        this.productoRepo = productoRepo;
        this.usrRepo = usrRepo;
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        this.logger.log('Verificando Seed Financiero...');
        let prov = await this.provRepo.findOne({ where: {} });
        if (!prov) {
            prov = await this.provRepo.save({
                NIT: '10203040', Nombre_RazonSocial: 'Importadora Mayorista XYZ',
            });
        }
        const adminUsr = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
        if (!adminUsr)
            return;
        const nota = await this.notaRepo.findOne({ where: {} });
        if (!nota) {
            await this.notaRepo.save({
                Fecha_Emision: new Date(),
                Monto_Total: 15000,
                Estado_Documento: 'ACTIVO',
                Condicion_Pago: 'CONTADO',
                ID_Proveedor: prov.ID_Proveedor,
                ID_Empleado: adminUsr.ID_Empleado,
            });
        }
    }
    getCompras() {
        return this.notaRepo.find({
            relations: ['proveedor', 'empleado', 'almacen'],
            order: { ID_Compra: 'DESC' },
        });
    }
    async getCompraById(id) {
        const compra = await this.notaRepo.findOne({
            where: { ID_Compra: id },
            relations: ['proveedor', 'empleado', 'almacen', 'detalles', 'detalles.producto', 'detalles.producto.medida'],
        });
        if (!compra)
            return null;
        const cuentasPorPagar = await this.cuentaRepo.find({
            where: { ID_Compra: id },
            relations: ['cuotas'],
            order: { ID_Cuenta: 'ASC' },
        });
        return { ...compra, cuentasPorPagar };
    }
    async getCompraStatus(id) {
        const compra = await this.notaRepo.findOne({ where: { ID_Compra: id } });
        if (!compra)
            throw new common_1.NotFoundException(`Compra #${id} no encontrada.`);
        return { Estado_Documento: compra.Estado_Documento };
    }
    async createCompra(dto, userId) {
        if (!dto.detalles || dto.detalles.length === 0) {
            throw new common_1.BadRequestException('La compra debe tener al menos un producto.');
        }
        const usuario = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
        if (!usuario)
            throw new common_1.BadRequestException('Usuario autenticado no encontrado.');
        const ID_Empleado = usuario.ID_Empleado;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const subTotal = dto.detalles.reduce((acc, d) => acc + d.Cantidad * d.Precio_Unitario, 0);
            const costoEnvio = dto.Costo_Envio ?? 0;
            const montoTotal = Math.round((subTotal + costoEnvio) * 100) / 100;
            const nota = queryRunner.manager.create(nota_compra_entity_1.NotaCompra, {
                Fecha_Emision: new Date(dto.Fecha_Emision),
                Hora_Emision: dto.Hora_Emision ?? null,
                ID_Almacen: dto.ID_Almacen ?? null,
                Costo_Envio: costoEnvio,
                Monto_Total: montoTotal,
                Estado_Documento: dto.Metodo_Pago === 'QR' ? 'ESPERANDO_PAGO' : 'ACTIVO',
                Condicion_Pago: dto.Condicion_Pago,
                ID_Proveedor: dto.ID_Proveedor,
                ID_Empleado,
                Nro_Factura: dto.Nro_Factura ?? null,
            });
            const notaGuardada = await queryRunner.manager.save(nota_compra_entity_1.NotaCompra, nota);
            for (const d of dto.detalles) {
                const subtotal = d.Cantidad * d.Precio_Unitario;
                const detalle = queryRunner.manager.create(detalle_compra_entity_1.DetalleCompra, {
                    ID_Compra: notaGuardada.ID_Compra,
                    ID_Producto: d.ID_Producto,
                    Cantidad: d.Cantidad,
                    Precio_Unitario: d.Precio_Unitario,
                    Subtotal: subtotal,
                    Fecha_Elaboracion: d.Fecha_Elaboracion ? new Date(d.Fecha_Elaboracion) : null,
                    Fecha_Vencimiento: d.Fecha_Vencimiento ? new Date(d.Fecha_Vencimiento) : null,
                });
                await queryRunner.manager.save(detalle_compra_entity_1.DetalleCompra, detalle);
            }
            if (dto.Condicion_Pago === 'CREDITO') {
                const cuotasValidas = (dto.cuotas ?? []).filter(c => !!c.Fecha_Vencimiento);
                let vencimientoCxP;
                if (cuotasValidas.length > 0) {
                    vencimientoCxP = new Date(cuotasValidas[cuotasValidas.length - 1].Fecha_Vencimiento);
                }
                else {
                    vencimientoCxP = new Date();
                    vencimientoCxP.setDate(vencimientoCxP.getDate() + 30);
                }
                const cuenta = queryRunner.manager.create(cuenta_por_pagar_entity_1.CuentaPorPagar, {
                    ID_Compra: notaGuardada.ID_Compra,
                    Saldo_Pendiente: montoTotal,
                    Fecha_Vencimiento: vencimientoCxP,
                    Estado_Pago: 'PENDIENTE',
                });
                const cuentaGuardada = await queryRunner.manager.save(cuenta_por_pagar_entity_1.CuentaPorPagar, cuenta);
                if (cuotasValidas.length > 0) {
                    const montoPorCuota = Math.round((montoTotal / cuotasValidas.length) * 100) / 100;
                    for (let i = 0; i < cuotasValidas.length; i++) {
                        const montoCuota = i === cuotasValidas.length - 1
                            ? Math.round((montoTotal - montoPorCuota * (cuotasValidas.length - 1)) * 100) / 100
                            : montoPorCuota;
                        const cuota = queryRunner.manager.create(cuota_cxp_entity_1.CuotaCxP, {
                            ID_Cuenta: cuentaGuardada.ID_Cuenta,
                            Numero_Cuota: i + 1,
                            Fecha_Vencimiento: new Date(cuotasValidas[i].Fecha_Vencimiento),
                            Monto: montoCuota,
                            Estado: 'PENDIENTE',
                        });
                        await queryRunner.manager.save(cuota_cxp_entity_1.CuotaCxP, cuota);
                    }
                }
            }
            await queryRunner.commitTransaction();
            return this.notaRepo.findOne({
                where: { ID_Compra: notaGuardada.ID_Compra },
                relations: ['proveedor', 'empleado', 'almacen', 'detalles', 'detalles.producto'],
            });
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Error al registrar compra: ${err.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async anularCompra(id) {
        const nota = await this.notaRepo.findOne({ where: { ID_Compra: id } });
        if (!nota)
            throw new common_1.NotFoundException(`Compra #${id} no encontrada.`);
        if (nota.Estado_Documento === 'ANULADO') {
            throw new common_1.BadRequestException('La compra ya está anulada.');
        }
        nota.Estado_Documento = 'ANULADO';
        return this.notaRepo.save(nota);
    }
    async generateQR(idCompra) {
        const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
        if (!compra)
            throw new common_1.NotFoundException(`Compra #${idCompra} no encontrada.`);
        const text = `paradiso-qr-pay://compra/${idCompra}`;
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=300&margin=2`;
        return { qrUrl };
    }
    async confirmarPagoQR(idCompra) {
        const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
        if (!compra)
            throw new common_1.NotFoundException(`Compra #${idCompra} no encontrada.`);
        if (compra.Estado_Documento === 'ACTIVO') {
            return { message: 'Compra ya estaba activada.' };
        }
        if (compra.Estado_Documento !== 'ESPERANDO_PAGO') {
            throw new common_1.BadRequestException('La compra no está en estado ESPERANDO_PAGO.');
        }
        compra.Estado_Documento = 'ACTIVO';
        await this.notaRepo.save(compra);
        return { message: 'Pago QR confirmado. Compra activada.' };
    }
    async confirmQrPayment(body) {
        const { idCuenta, montoPagado, referencia } = body;
        this.logger.log(`[API Sandbox] Procesando pago para Cuenta #${idCuenta} por Bs. ${montoPagado}`);
        const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
        if (!cuenta)
            throw new common_1.NotFoundException(`La cuenta por pagar #${idCuenta} no existe`);
        const admin = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
        if (!admin)
            throw new common_1.BadRequestException('Usuario administrador no encontrado para registrar pago simulado.');
        return this.registrarPago({
            ID_Cuenta: idCuenta,
            Monto_Pagado: montoPagado,
            Fecha_Pago: new Date().toISOString().split('T')[0],
            Metodo_Pago: 'QR',
            Referencia_Comprobante: referencia,
            Observaciones: 'Pago automático vía API Sandbox Simulado',
        }, admin.ID_Usuario);
    }
    getCuentasPorPagar() {
        return this.cuentaRepo.find({
            relations: ['notaCompra', 'notaCompra.proveedor', 'cuotas'],
            order: { Fecha_Vencimiento: 'ASC' },
        });
    }
    async getAlertasCxP() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const proximas5 = new Date(hoy);
        proximas5.setDate(proximas5.getDate() + 5);
        const todas = await this.cuentaRepo.find({
            where: [{ Estado_Pago: 'PENDIENTE' }, { Estado_Pago: 'PARCIAL' }],
            relations: ['notaCompra', 'notaCompra.proveedor'],
        });
        const pendientes = todas.filter(c => parseFloat(c.Saldo_Pendiente.toString()) > 0);
        const vencidas = pendientes.filter(c => {
            const fv = new Date(c.Fecha_Vencimiento);
            fv.setHours(0, 0, 0, 0);
            return fv < hoy;
        });
        const proximas = pendientes.filter(c => {
            const fv = new Date(c.Fecha_Vencimiento);
            fv.setHours(0, 0, 0, 0);
            return fv >= hoy && fv <= proximas5;
        });
        const cuotasPendientes = await this.cuotaRepo.find({
            where: { Estado: 'PENDIENTE' },
            relations: ['cuentaPorPagar', 'cuentaPorPagar.notaCompra', 'cuentaPorPagar.notaCompra.proveedor'],
        });
        const cuotasVencidas = cuotasPendientes.filter(q => {
            const fv = new Date(q.Fecha_Vencimiento);
            fv.setHours(0, 0, 0, 0);
            return fv < hoy;
        });
        const cuotasProximas = cuotasPendientes.filter(q => {
            const fv = new Date(q.Fecha_Vencimiento);
            fv.setHours(0, 0, 0, 0);
            return fv >= hoy && fv <= proximas5;
        });
        return { vencidas, proximas, cuotasVencidas, cuotasProximas };
    }
    async marcarCuentaPagada(id) {
        const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: id } });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta #${id} no encontrada.`);
        cuenta.Estado_Pago = 'PAGADO';
        cuenta.Saldo_Pendiente = 0;
        return this.cuentaRepo.save(cuenta);
    }
    async registrarPago(dto, userId) {
        const usuario = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
        if (!usuario)
            throw new common_1.BadRequestException('Usuario no encontrado.');
        const ID_Empleado = usuario.ID_Empleado;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cuenta = await queryRunner.manager.findOne(cuenta_por_pagar_entity_1.CuentaPorPagar, {
                where: { ID_Cuenta: dto.ID_Cuenta },
                lock: { mode: 'pessimistic_write' },
            });
            if (!cuenta)
                throw new common_1.NotFoundException(`Cuenta #${dto.ID_Cuenta} no encontrada.`);
            if (cuenta.Estado_Pago === 'PAGADO') {
                throw new common_1.BadRequestException('Esta cuenta ya está completamente pagada.');
            }
            const saldoActual = parseFloat(cuenta.Saldo_Pendiente.toString());
            const montoPagado = parseFloat(dto.Monto_Pagado.toString());
            if (montoPagado <= 0) {
                throw new common_1.BadRequestException('El monto a pagar debe ser mayor a 0.');
            }
            if (montoPagado > saldoActual + 0.001) {
                throw new common_1.BadRequestException(`El monto (${montoPagado.toFixed(2)}) supera el saldo pendiente (${saldoActual.toFixed(2)}).`);
            }
            if (dto.ID_CuotaCxP !== undefined) {
                const cuota = await queryRunner.manager.findOne(cuota_cxp_entity_1.CuotaCxP, {
                    where: { ID_CuotaCxP: dto.ID_CuotaCxP },
                });
                if (!cuota)
                    throw new common_1.BadRequestException(`Cuota #${dto.ID_CuotaCxP} no encontrada.`);
                if (cuota.ID_Cuenta !== dto.ID_Cuenta) {
                    throw new common_1.BadRequestException('La cuota no pertenece a esta cuenta.');
                }
                if (cuota.Estado !== 'PENDIENTE') {
                    throw new common_1.BadRequestException(`La cuota #${cuota.Numero_Cuota} ya fue procesada.`);
                }
                const montoCuota = parseFloat(cuota.Monto.toString());
                if (Math.abs(montoPagado - montoCuota) > 0.005) {
                    throw new common_1.BadRequestException(`Monto incorrecto: la cuota #${cuota.Numero_Cuota} requiere exactamente Bs. ${montoCuota.toFixed(2)}.`);
                }
            }
            const pago = queryRunner.manager.create(pago_entity_1.Pago, {
                Monto_Pagado: montoPagado,
                Fecha_Pago: new Date(dto.Fecha_Pago),
                Metodo_Pago: dto.Metodo_Pago,
                Referencia_Comprobante: dto.Referencia_Comprobante ?? null,
                Observaciones: dto.Observaciones ?? null,
                ID_Cuenta: dto.ID_Cuenta,
                ID_Empleado,
            });
            const pagoGuardado = await queryRunner.manager.save(pago_entity_1.Pago, pago);
            const nuevoSaldo = Math.max(0, Math.round((saldoActual * 100 - montoPagado * 100)) / 100);
            cuenta.Saldo_Pendiente = nuevoSaldo;
            cuenta.Estado_Pago = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';
            await queryRunner.manager.save(cuenta_por_pagar_entity_1.CuentaPorPagar, cuenta);
            const cuotasPend = await queryRunner.manager.find(cuota_cxp_entity_1.CuotaCxP, {
                where: { ID_Cuenta: dto.ID_Cuenta, Estado: 'PENDIENTE' },
                order: { Fecha_Vencimiento: 'ASC' },
            });
            let restante = montoPagado;
            for (const cuota of cuotasPend) {
                if (restante <= 0)
                    break;
                const mc = parseFloat(cuota.Monto.toString());
                if (restante >= mc - 0.001) {
                    cuota.Estado = 'PAGADO';
                    restante = Math.round((restante - mc) * 100) / 100;
                    await queryRunner.manager.save(cuota_cxp_entity_1.CuotaCxP, cuota);
                }
                else {
                    break;
                }
            }
            await queryRunner.commitTransaction();
            return pagoGuardado;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            if (err instanceof common_1.BadRequestException || err instanceof common_1.NotFoundException)
                throw err;
            throw new common_1.BadRequestException(`Error al registrar pago: ${err.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    getHistorialPagosCuenta(id) {
        return this.pagoRepo.find({
            where: { ID_Cuenta: id },
            relations: ['empleado'],
            order: { Fecha_Pago: 'DESC' },
        });
    }
    async getCuentaPorPagarById(id) {
        const cuenta = await this.cuentaRepo.findOne({
            where: { ID_Cuenta: id },
            relations: ['notaCompra', 'notaCompra.proveedor'],
        });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta #${id} no encontrada.`);
        return cuenta;
    }
    async pollingCxP(id) {
        const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: id } });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta #${id} no encontrada.`);
        return {
            Saldo_Pendiente: parseFloat(cuenta.Saldo_Pendiente.toString()),
            Estado_Pago: cuenta.Estado_Pago,
        };
    }
    async getCuotasCuenta(idCuenta) {
        const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta #${idCuenta} no encontrada.`);
        return this.cuotaRepo.find({
            where: { ID_Cuenta: idCuenta },
            order: { Numero_Cuota: 'ASC' },
        });
    }
    async generateQRPaymentRef(idCuenta) {
        const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta #${idCuenta} no encontrada.`);
        if (cuenta.Estado_Pago === 'PAGADO') {
            throw new common_1.BadRequestException('Esta cuenta ya está completamente pagada.');
        }
        const externalRef = `PAY-${idCuenta}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        this.pendingQRRefs.set(externalRef, { idCuenta, expiresAt: Date.now() + 15 * 60 * 1000 });
        return { externalRef };
    }
    async webhookQRConfirm(dto) {
        const pending = this.pendingQRRefs.get(dto.externalRef);
        if (!pending)
            throw new common_1.BadRequestException('Referencia de pago no encontrada o expirada.');
        if (Date.now() > pending.expiresAt) {
            this.pendingQRRefs.delete(dto.externalRef);
            throw new common_1.BadRequestException('La referencia de pago ha expirado. Reinicia el proceso QR.');
        }
        this.pendingQRRefs.delete(dto.externalRef);
        const admin = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
        if (!admin)
            throw new common_1.BadRequestException('Usuario administrador no encontrado.');
        return this.registrarPago({
            ID_Cuenta: pending.idCuenta,
            Monto_Pagado: dto.montoPagado,
            Fecha_Pago: new Date().toISOString().split('T')[0],
            Metodo_Pago: 'QR',
            Referencia_Comprobante: dto.transactionToken,
            Observaciones: 'Pago automático vía API Sandbox',
        }, admin.ID_Usuario);
    }
    async obtenerOCrearTransaccionLibelula(idCompra) {
        const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
        if (!compra)
            throw new common_1.NotFoundException(`Compra #${idCompra} no encontrada.`);
        if (compra.Ref_Libelula && compra.Estado_Documento === 'ESPERANDO_PAGO') {
            this.logger.log(`[Libélula] Reutilizando Ref_Libelula existente para Compra #${idCompra}: ${compra.Ref_Libelula}`);
            this.pendingLibelulaCompras.set(compra.Ref_Libelula, idCompra);
            return {
                idTransaccion: compra.Ref_Libelula,
                qrUrl: compra.Qr_Url ?? null,
                idLibelula: compra.Id_Libelula ?? null,
                codigoRecaudacion: compra.Codigo_Recaudacion ?? null,
            };
        }
        const idTransaccion = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        this.pendingLibelulaCompras.set(idTransaccion, idCompra);
        const previas = JSON.parse(compra.Refs_Previas ?? '[]');
        if (compra.Ref_Libelula && !previas.includes(compra.Ref_Libelula)) {
            previas.push(compra.Ref_Libelula);
        }
        await this.notaRepo.update({ ID_Compra: idCompra }, {
            Ref_Libelula: idTransaccion,
            Qr_Url: null,
            Refs_Previas: previas.length > 0 ? JSON.stringify(previas) : null,
        });
        this.logger.log(`[Libélula] Nuevo idTransaccion para Compra #${idCompra}: ${idTransaccion} | previas: ${previas.length}`);
        return { idTransaccion, qrUrl: null, idLibelula: null, codigoRecaudacion: null };
    }
    async guardarQrUrl(idCompra, qrUrl, idLibelula, codigoRecaudacion) {
        const patch = { Qr_Url: qrUrl };
        if (idLibelula)
            patch.Id_Libelula = idLibelula;
        if (codigoRecaudacion)
            patch.Codigo_Recaudacion = codigoRecaudacion;
        await this.notaRepo.update({ ID_Compra: idCompra }, patch);
    }
    async actualizarIdsLibelula(idCompra, dto) {
        const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
        if (!compra)
            throw new common_1.NotFoundException(`Compra #${idCompra} no encontrada.`);
        const patch = {};
        if (dto.idTransaccion)
            patch.Id_Libelula = dto.idTransaccion;
        if (dto.codigoRecaudacion)
            patch.Codigo_Recaudacion = dto.codigoRecaudacion;
        if (Object.keys(patch).length === 0)
            throw new common_1.BadRequestException('Debes enviar al menos idTransaccion o codigoRecaudacion.');
        await this.notaRepo.update({ ID_Compra: idCompra }, patch);
        this.logger.log(`[Libélula] IDs corregidos manualmente para Compra #${idCompra}: ${JSON.stringify(dto)}`);
    }
    async webhookLibelulaConfirm(body) {
        const idTransaccion = body?.identificador_deuda ?? body?.transaction_id ?? '';
        if (!idTransaccion) {
            this.logger.warn('[Webhook Libélula] Sin identificador_deuda en payload');
            return { ok: true };
        }
        let idCompra = this.pendingLibelulaCompras.get(idTransaccion);
        if (!idCompra) {
            this.logger.warn(`[Webhook Libélula] '${idTransaccion}' no está en memoria, buscando en BD...`);
            const compraByRef = await this.notaRepo.findOne({ where: { Ref_Libelula: idTransaccion } });
            if (compraByRef) {
                idCompra = compraByRef.ID_Compra;
            }
            else {
                const compraByUUID = await this.notaRepo.findOne({ where: { Id_Libelula: idTransaccion } });
                if (compraByUUID) {
                    this.logger.log(`[Webhook Libélula] Encontrado por Id_Libelula: ${idTransaccion} → Compra #${compraByUUID.ID_Compra}`);
                    idCompra = compraByUUID.ID_Compra;
                }
                else {
                    this.logger.error(`[Webhook Libélula] '${idTransaccion}' no encontrado por Ref_Libelula ni Id_Libelula`);
                    return { ok: true };
                }
            }
        }
        this.pendingLibelulaCompras.delete(idTransaccion);
        await this.confirmarPagoQR(idCompra);
        this.logger.log(`[Webhook Libélula] Compra #${idCompra} marcada ACTIVO`);
        return { ok: true };
    }
    getProveedores() {
        return this.provRepo.find({ order: { ID_Proveedor: 'DESC' } });
    }
    getCuentasPorPagarLegado() {
        return this.planRepo.createQueryBuilder('pp')
            .leftJoinAndSelect('pp.pago', 'p')
            .leftJoinAndSelect('p.notaCompra', 'nc')
            .leftJoinAndSelect('nc.proveedor', 'prov')
            .orderBy('pp.Fecha', 'ASC')
            .getMany();
    }
    async marcarPago(pagoId, cuotaId) {
        const cuota = await this.planRepo.findOne({ where: { ID_Pago: pagoId, ID_Cuota: cuotaId } });
        if (!cuota)
            throw new common_1.BadRequestException('Cuota no existe');
        cuota.Estado = 'PAGADO';
        return this.planRepo.save(cuota);
    }
    async getEstadisticas() {
        const cuentas = await this.cuentaRepo.find({ where: { Estado_Pago: 'PENDIENTE' } });
        const deudaLiquida = cuentas.reduce((acc, c) => acc + parseFloat(c.Saldo_Pendiente.toString()), 0);
        const manager = this.notaRepo.manager;
        const result = await manager.query(`SELECT SUM("Stock_Actual" * "PrecioUnitario") as capital FROM "ProductoAlmacen" pa JOIN "Producto" p ON p."ID_Producto" = pa."ID_Producto"`);
        const capitalInmovilizado = result[0]?.capital ? parseFloat(result[0].capital) : 0;
        const rawStats = await manager.query(`
      SELECT c."NombreC" as name, COALESCE(SUM(pa."Stock_Actual" * p."PrecioUnitario"), 0) as value
      FROM "ProductoAlmacen" pa
      JOIN "Producto" p ON p."ID_Producto" = pa."ID_Producto"
      JOIN "Categoria" c ON c."ID_Categoria" = p."ID_Categoria"
      GROUP BY c."NombreC"
    `);
        const dspStats = await manager.query(`
      SELECT d."FechaSalida" as name, cast(COUNT(d."ID_Despacho") as INTEGER) as count
      FROM "Despacho" d
      GROUP BY d."FechaSalida"
      ORDER BY d."FechaSalida" ASC
      LIMIT 7
    `);
        return {
            deudaLiquida,
            capitalInmovilizado,
            pieData: rawStats.map((r) => ({ ...r, value: parseFloat(r.value) })),
            barData: dspStats,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nota_compra_entity_1.NotaCompra)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_compra_entity_1.DetalleCompra)),
    __param(2, (0, typeorm_1.InjectRepository)(cuenta_por_pagar_entity_1.CuentaPorPagar)),
    __param(3, (0, typeorm_1.InjectRepository)(cuota_cxp_entity_1.CuotaCxP)),
    __param(4, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __param(5, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(6, (0, typeorm_1.InjectRepository)(plan_pago_entity_1.PlanPago)),
    __param(7, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(8, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map