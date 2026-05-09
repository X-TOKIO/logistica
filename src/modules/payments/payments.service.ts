import { Injectable, BadRequestException, NotFoundException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class PaymentsService implements OnApplicationBootstrap {
  private readonly logger = new Logger('PaymentsService');

  private readonly pendingQRRefs = new Map<string, { idCuenta: number; expiresAt: number }>();
  private readonly pendingLibelulaCompras = new Map<string, number>();

  constructor(
    @InjectRepository(NotaCompra) private notaRepo: Repository<NotaCompra>,
    @InjectRepository(DetalleCompra) private detalleRepo: Repository<DetalleCompra>,
    @InjectRepository(CuentaPorPagar) private cuentaRepo: Repository<CuentaPorPagar>,
    @InjectRepository(CuotaCxP) private cuotaRepo: Repository<CuotaCxP>,
    @InjectRepository(Proveedor) private provRepo: Repository<Proveedor>,
    @InjectRepository(Pago) private pagoRepo: Repository<Pago>,
    @InjectRepository(PlanPago) private planRepo: Repository<PlanPago>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(Usuario) private usrRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) { }

  async onApplicationBootstrap() {
    this.logger.log('Verificando Seed Financiero...');
    let prov = await this.provRepo.findOne({ where: {} });
    if (!prov) {
      prov = await this.provRepo.save({
        NIT: '10203040', Nombre_RazonSocial: 'Importadora Mayorista XYZ',
      });
    }

    const adminUsr = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
    if (!adminUsr) return;

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

  // ── Compras ────────────────────────────────────────────────────────────────

  getCompras() {
    return this.notaRepo.find({
      relations: ['proveedor', 'empleado', 'almacen'],
      order: { ID_Compra: 'DESC' },
    });
  }

  async getCompraById(id: number) {
    const compra = await this.notaRepo.findOne({
      where: { ID_Compra: id },
      relations: ['proveedor', 'empleado', 'almacen', 'detalles', 'detalles.producto', 'detalles.producto.medida'],
    });
    if (!compra) return null;
    const cuentasPorPagar = await this.cuentaRepo.find({
      where: { ID_Compra: id },
      relations: ['cuotas'],
      order: { ID_Cuenta: 'ASC' },
    });
    return { ...compra, cuentasPorPagar };
  }

  async getCompraStatus(id: number): Promise<{ Estado_Documento: string }> {
    const compra = await this.notaRepo.findOne({ where: { ID_Compra: id } });
    if (!compra) throw new NotFoundException(`Compra #${id} no encontrada.`);
    return { Estado_Documento: compra.Estado_Documento };
  }

  async createCompra(dto: CreateCompraDto, userId: number) {
    if (!dto.detalles || dto.detalles.length === 0) {
      throw new BadRequestException('La compra debe tener al menos un producto.');
    }

    const usuario = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
    if (!usuario) throw new BadRequestException('Usuario autenticado no encontrado.');
    const ID_Empleado = usuario.ID_Empleado;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subTotal = dto.detalles.reduce(
        (acc, d) => acc + d.Cantidad * d.Precio_Unitario,
        0,
      );
      const costoEnvio = dto.Costo_Envio ?? 0;
      const montoTotal = Math.round((subTotal + costoEnvio) * 100) / 100;

      const nota = queryRunner.manager.create(NotaCompra, {
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
      } as any);
      const notaGuardada = await queryRunner.manager.save(NotaCompra, nota);

      for (const d of dto.detalles) {
        const subtotal = d.Cantidad * d.Precio_Unitario;
        const detalle = queryRunner.manager.create(DetalleCompra, {
          ID_Compra: notaGuardada.ID_Compra,
          ID_Producto: d.ID_Producto,
          Cantidad: d.Cantidad,
          Precio_Unitario: d.Precio_Unitario,
          Subtotal: subtotal,
          Fecha_Elaboracion: d.Fecha_Elaboracion ? new Date(d.Fecha_Elaboracion) : null,
          Fecha_Vencimiento: d.Fecha_Vencimiento ? new Date(d.Fecha_Vencimiento) : null,
        });
        await queryRunner.manager.save(DetalleCompra, detalle);
      }

      if (dto.Condicion_Pago === 'CREDITO') {
        const cuotasValidas = (dto.cuotas ?? []).filter(c => !!c.Fecha_Vencimiento);
        let vencimientoCxP: Date;
        if (cuotasValidas.length > 0) {
          vencimientoCxP = new Date(cuotasValidas[cuotasValidas.length - 1].Fecha_Vencimiento);
        } else {
          vencimientoCxP = new Date();
          vencimientoCxP.setDate(vencimientoCxP.getDate() + 30);
        }

        const cuenta = queryRunner.manager.create(CuentaPorPagar, {
          ID_Compra: notaGuardada.ID_Compra,
          Saldo_Pendiente: montoTotal,
          Fecha_Vencimiento: vencimientoCxP,
          Estado_Pago: 'PENDIENTE',
        });
        const cuentaGuardada = await queryRunner.manager.save(CuentaPorPagar, cuenta);

        if (cuotasValidas.length > 0) {
          const montoPorCuota = Math.round((montoTotal / cuotasValidas.length) * 100) / 100;
          for (let i = 0; i < cuotasValidas.length; i++) {
            const montoCuota =
              i === cuotasValidas.length - 1
                ? Math.round((montoTotal - montoPorCuota * (cuotasValidas.length - 1)) * 100) / 100
                : montoPorCuota;
            const cuota = queryRunner.manager.create(CuotaCxP, {
              ID_Cuenta: cuentaGuardada.ID_Cuenta,
              Numero_Cuota: i + 1,
              Fecha_Vencimiento: new Date(cuotasValidas[i].Fecha_Vencimiento),
              Monto: montoCuota,
              Estado: 'PENDIENTE',
            });
            await queryRunner.manager.save(CuotaCxP, cuota);
          }
        }
      }

      await queryRunner.commitTransaction();

      return this.notaRepo.findOne({
        where: { ID_Compra: notaGuardada.ID_Compra },
        relations: ['proveedor', 'empleado', 'almacen', 'detalles', 'detalles.producto'],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al registrar compra: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async anularCompra(id: number) {
    const nota = await this.notaRepo.findOne({ where: { ID_Compra: id } });
    if (!nota) throw new NotFoundException(`Compra #${id} no encontrada.`);
    if (nota.Estado_Documento === 'ANULADO') {
      throw new BadRequestException('La compra ya está anulada.');
    }
    nota.Estado_Documento = 'ANULADO';
    return this.notaRepo.save(nota);
  }

  // ── Pasarela QR Sandbox ────────────────────────────────────────────────────

  async generateQR(idCompra: number): Promise<{ qrUrl: string }> {
    const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
    if (!compra) throw new NotFoundException(`Compra #${idCompra} no encontrada.`);
    const text = `paradiso-qr-pay://compra/${idCompra}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=300&margin=2`;
    return { qrUrl };
  }

  async confirmarPagoQR(idCompra: number) {
    const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
    if (!compra) throw new NotFoundException(`Compra #${idCompra} no encontrada.`);
    if (compra.Estado_Documento === 'ACTIVO') {
      return { message: 'Compra ya estaba activada.' };
    }
    if (compra.Estado_Documento !== 'ESPERANDO_PAGO') {
      throw new BadRequestException('La compra no está en estado ESPERANDO_PAGO.');
    }
    compra.Estado_Documento = 'ACTIVO';
    await this.notaRepo.save(compra);
    return { message: 'Pago QR confirmado. Compra activada.' };
  }

  // --- Método para sincronizar con el Webhook Simulado ---
  async confirmQrPayment(body: { idCuenta: number; montoPagado: number; referencia: string }) {
    const { idCuenta, montoPagado, referencia } = body;
    this.logger.log(`[API Sandbox] Procesando pago para Cuenta #${idCuenta} por Bs. ${montoPagado}`);

    const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
    if (!cuenta) throw new NotFoundException(`La cuenta por pagar #${idCuenta} no existe`);

    const admin = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
    if (!admin) throw new BadRequestException('Usuario administrador no encontrado para registrar pago simulado.');

    return this.registrarPago({
      ID_Cuenta: idCuenta,
      Monto_Pagado: montoPagado,
      Fecha_Pago: new Date().toISOString().split('T')[0],
      Metodo_Pago: 'QR',
      Referencia_Comprobante: referencia,
      Observaciones: 'Pago automático vía API Sandbox Simulado',
    }, admin.ID_Usuario);
  }

  // ── Cuentas por Pagar ──────────────────────────────────────────────────────

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

  async marcarCuentaPagada(id: number) {
    const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: id } });
    if (!cuenta) throw new NotFoundException(`Cuenta #${id} no encontrada.`);
    cuenta.Estado_Pago = 'PAGADO';
    cuenta.Saldo_Pendiente = 0;
    return this.cuentaRepo.save(cuenta);
  }

  // ── Registro de Pagos (Fase 3) ─────────────────────────────────────────────

  async registrarPago(dto: RegistrarPagoDto, userId: number) {
    const usuario = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
    if (!usuario) throw new BadRequestException('Usuario no encontrado.');
    const ID_Empleado = usuario.ID_Empleado;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(CuentaPorPagar, {
        where: { ID_Cuenta: dto.ID_Cuenta },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cuenta) throw new NotFoundException(`Cuenta #${dto.ID_Cuenta} no encontrada.`);
      if (cuenta.Estado_Pago === 'PAGADO') {
        throw new BadRequestException('Esta cuenta ya está completamente pagada.');
      }

      const saldoActual = parseFloat(cuenta.Saldo_Pendiente.toString());
      const montoPagado = parseFloat(dto.Monto_Pagado.toString());

      if (montoPagado <= 0) {
        throw new BadRequestException('El monto a pagar debe ser mayor a 0.');
      }
      if (montoPagado > saldoActual + 0.001) {
        throw new BadRequestException(
          `El monto (${montoPagado.toFixed(2)}) supera el saldo pendiente (${saldoActual.toFixed(2)}).`,
        );
      }

      if (dto.ID_CuotaCxP !== undefined) {
        const cuota = await queryRunner.manager.findOne(CuotaCxP, {
          where: { ID_CuotaCxP: dto.ID_CuotaCxP },
        });
        if (!cuota) throw new BadRequestException(`Cuota #${dto.ID_CuotaCxP} no encontrada.`);
        if (cuota.ID_Cuenta !== dto.ID_Cuenta) {
          throw new BadRequestException('La cuota no pertenece a esta cuenta.');
        }
        if (cuota.Estado !== 'PENDIENTE') {
          throw new BadRequestException(`La cuota #${cuota.Numero_Cuota} ya fue procesada.`);
        }
        const montoCuota = parseFloat(cuota.Monto.toString());
        if (Math.abs(montoPagado - montoCuota) > 0.005) {
          throw new BadRequestException(
            `Monto incorrecto: la cuota #${cuota.Numero_Cuota} requiere exactamente Bs. ${montoCuota.toFixed(2)}.`,
          );
        }
      }

      const pago = queryRunner.manager.create(Pago, {
        Monto_Pagado: montoPagado,
        Fecha_Pago: new Date(dto.Fecha_Pago),
        Metodo_Pago: dto.Metodo_Pago,
        Referencia_Comprobante: dto.Referencia_Comprobante ?? null,
        Observaciones: dto.Observaciones ?? null,
        ID_Cuenta: dto.ID_Cuenta,
        ID_Empleado,
      } as any);
      const pagoGuardado = await queryRunner.manager.save(Pago, pago);

      const nuevoSaldo = Math.max(0, Math.round((saldoActual * 100 - montoPagado * 100)) / 100);
      cuenta.Saldo_Pendiente = nuevoSaldo;
      cuenta.Estado_Pago = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';
      await queryRunner.manager.save(CuentaPorPagar, cuenta);

      // FIFO: aplicar el pago a las cuotas más antiguas primero
      const cuotasPend = await queryRunner.manager.find(CuotaCxP, {
        where: { ID_Cuenta: dto.ID_Cuenta, Estado: 'PENDIENTE' },
        order: { Fecha_Vencimiento: 'ASC' },
      });
      let restante = montoPagado;
      for (const cuota of cuotasPend) {
        if (restante <= 0) break;
        const mc = parseFloat(cuota.Monto.toString());
        if (restante >= mc - 0.001) {
          cuota.Estado = 'PAGADO';
          restante = Math.round((restante - mc) * 100) / 100;
          await queryRunner.manager.save(CuotaCxP, cuota);
        } else {
          break; // pago parcial en esta cuota, queda PENDIENTE
        }
      }

      await queryRunner.commitTransaction();

      return pagoGuardado;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException || err instanceof NotFoundException) throw err;
      throw new BadRequestException(`Error al registrar pago: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  getHistorialPagosCuenta(id: number) {
    return this.pagoRepo.find({
      where: { ID_Cuenta: id },
      relations: ['empleado'],
      order: { Fecha_Pago: 'DESC' },
    });
  }

  async getCuentaPorPagarById(id: number) {
    const cuenta = await this.cuentaRepo.findOne({
      where: { ID_Cuenta: id },
      relations: ['notaCompra', 'notaCompra.proveedor'],
    });
    if (!cuenta) throw new NotFoundException(`Cuenta #${id} no encontrada.`);
    return cuenta;
  }

  async pollingCxP(id: number): Promise<{ Saldo_Pendiente: number; Estado_Pago: string }> {
    const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: id } });
    if (!cuenta) throw new NotFoundException(`Cuenta #${id} no encontrada.`);
    return {
      Saldo_Pendiente: parseFloat(cuenta.Saldo_Pendiente.toString()),
      Estado_Pago: cuenta.Estado_Pago,
    };
  }

  async getCuotasCuenta(idCuenta: number): Promise<CuotaCxP[]> {
    const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
    if (!cuenta) throw new NotFoundException(`Cuenta #${idCuenta} no encontrada.`);
    return this.cuotaRepo.find({
      where: { ID_Cuenta: idCuenta },
      order: { Numero_Cuota: 'ASC' },
    });
  }

  async generateQRPaymentRef(idCuenta: number): Promise<{ externalRef: string }> {
    const cuenta = await this.cuentaRepo.findOne({ where: { ID_Cuenta: idCuenta } });
    if (!cuenta) throw new NotFoundException(`Cuenta #${idCuenta} no encontrada.`);
    if (cuenta.Estado_Pago === 'PAGADO') {
      throw new BadRequestException('Esta cuenta ya está completamente pagada.');
    }
    const externalRef = `PAY-${idCuenta}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    this.pendingQRRefs.set(externalRef, { idCuenta, expiresAt: Date.now() + 15 * 60 * 1000 });
    return { externalRef };
  }

  async webhookQRConfirm(dto: { transactionToken: string; externalRef: string; montoPagado: number }) {
    const pending = this.pendingQRRefs.get(dto.externalRef);
    if (!pending) throw new BadRequestException('Referencia de pago no encontrada o expirada.');
    if (Date.now() > pending.expiresAt) {
      this.pendingQRRefs.delete(dto.externalRef);
      throw new BadRequestException('La referencia de pago ha expirado. Reinicia el proceso QR.');
    }
    this.pendingQRRefs.delete(dto.externalRef);

    const admin = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
    if (!admin) throw new BadRequestException('Usuario administrador no encontrado.');

    return this.registrarPago({
      ID_Cuenta: pending.idCuenta,
      Monto_Pagado: dto.montoPagado,
      Fecha_Pago: new Date().toISOString().split('T')[0],
      Metodo_Pago: 'QR',
      Referencia_Comprobante: dto.transactionToken,
      Observaciones: 'Pago automático vía API Sandbox',
    }, admin.ID_Usuario);
  }

  // ── Webhook Libélula ──────────────────────────────────────────────────────

  async obtenerOCrearTransaccionLibelula(idCompra: number): Promise<{
    idTransaccion: string; qrUrl: string | null; idLibelula: string | null; codigoRecaudacion: string | null;
  }> {
    const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
    if (!compra) throw new NotFoundException(`Compra #${idCompra} no encontrada.`);

    if (compra.Ref_Libelula && compra.Estado_Documento === 'ESPERANDO_PAGO') {
      this.logger.log(`[Libélula] Reutilizando Ref_Libelula existente para Compra #${idCompra}: ${compra.Ref_Libelula}`);
      this.pendingLibelulaCompras.set(compra.Ref_Libelula, idCompra);
      return {
        idTransaccion: compra.Ref_Libelula,
        qrUrl: compra.Qr_Url ?? null,
        idLibelula: (compra as any).Id_Libelula ?? null,
        codigoRecaudacion: (compra as any).Codigo_Recaudacion ?? null,
      };
    }

    const idTransaccion = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    this.pendingLibelulaCompras.set(idTransaccion, idCompra);

    // Archiva el ref anterior para poder consultarlo si fue el que se pagó (doble disparo)
    const previas: string[] = JSON.parse((compra as any).Refs_Previas ?? '[]');
    if (compra.Ref_Libelula && !previas.includes(compra.Ref_Libelula)) {
      previas.push(compra.Ref_Libelula);
    }
    await this.notaRepo.update({ ID_Compra: idCompra }, {
      Ref_Libelula: idTransaccion,
      Qr_Url: null,
      Refs_Previas: previas.length > 0 ? JSON.stringify(previas) : null,
    } as any);
    this.logger.log(`[Libélula] Nuevo idTransaccion para Compra #${idCompra}: ${idTransaccion} | previas: ${previas.length}`);
    return { idTransaccion, qrUrl: null, idLibelula: null, codigoRecaudacion: null };
  }

  async guardarQrUrl(idCompra: number, qrUrl: string, idLibelula?: string, codigoRecaudacion?: string): Promise<void> {
    const patch: any = { Qr_Url: qrUrl };
    if (idLibelula) patch.Id_Libelula = idLibelula;
    if (codigoRecaudacion) patch.Codigo_Recaudacion = codigoRecaudacion;
    await this.notaRepo.update({ ID_Compra: idCompra }, patch);
  }

  /** Permite fijar manualmente el UUID y/o código de recaudación de Libélula (para compras históricas). */
  async actualizarIdsLibelula(idCompra: number, dto: { idTransaccion?: string; codigoRecaudacion?: string }): Promise<void> {
    const compra = await this.notaRepo.findOne({ where: { ID_Compra: idCompra } });
    if (!compra) throw new NotFoundException(`Compra #${idCompra} no encontrada.`);
    const patch: any = {};
    if (dto.idTransaccion) patch.Id_Libelula = dto.idTransaccion;
    if (dto.codigoRecaudacion) patch.Codigo_Recaudacion = dto.codigoRecaudacion;
    if (Object.keys(patch).length === 0) throw new BadRequestException('Debes enviar al menos idTransaccion o codigoRecaudacion.');
    await this.notaRepo.update({ ID_Compra: idCompra }, patch);
    this.logger.log(`[Libélula] IDs corregidos manualmente para Compra #${idCompra}: ${JSON.stringify(dto)}`);
  }

  async webhookLibelulaConfirm(body: any) {
    const idTransaccion: string = body?.identificador_deuda ?? body?.transaction_id ?? '';
    if (!idTransaccion) {
      this.logger.warn('[Webhook Libélula] Sin identificador_deuda en payload');
      return { ok: true };
    }

    // Primero intenta el mapa en memoria (caso normal)
    let idCompra = this.pendingLibelulaCompras.get(idTransaccion);

    // Fallback: busca en BD (cubre reinicios del servidor entre el QR y el webhook)
    if (!idCompra) {
      this.logger.warn(`[Webhook Libélula] '${idTransaccion}' no está en memoria, buscando en BD...`);

      // Intento 1: por Ref_Libelula (el identificador_deuda que nosotros enviamos)
      const compraByRef = await this.notaRepo.findOne({ where: { Ref_Libelula: idTransaccion } });
      if (compraByRef) {
        idCompra = compraByRef.ID_Compra;
      } else {
        // Intento 2: por Id_Libelula (UUID que Libélula asigna a la transacción)
        const compraByUUID = await this.notaRepo.findOne({ where: { Id_Libelula: idTransaccion } });
        if (compraByUUID) {
          this.logger.log(`[Webhook Libélula] Encontrado por Id_Libelula: ${idTransaccion} → Compra #${compraByUUID.ID_Compra}`);
          idCompra = compraByUUID.ID_Compra;
        } else {
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

  // ── Proveedores ────────────────────────────────────────────────────────────

  getProveedores() {
    return this.provRepo.find({ order: { ID_Proveedor: 'DESC' } });
  }

  // ── Legado: Plan de Pagos (PlanPago) ──────────────────────────────────────

  getCuentasPorPagarLegado() {
    return this.planRepo.createQueryBuilder('pp')
      .leftJoinAndSelect('pp.pago', 'p')
      .leftJoinAndSelect('p.notaCompra', 'nc')
      .leftJoinAndSelect('nc.proveedor', 'prov')
      .orderBy('pp.Fecha', 'ASC')
      .getMany();
  }

  async marcarPago(pagoId: number, cuotaId: number) {
    const cuota = await this.planRepo.findOne({ where: { ID_Pago: pagoId, ID_Cuota: cuotaId } });
    if (!cuota) throw new BadRequestException('Cuota no existe');
    cuota.Estado = 'PAGADO';
    return this.planRepo.save(cuota);
  }

  // ── Estadísticas ──────────────────────────────────────────────────────────

  async getEstadisticas() {
    const cuentas = await this.cuentaRepo.find({ where: { Estado_Pago: 'PENDIENTE' } });
    const deudaLiquida = cuentas.reduce(
      (acc, c) => acc + parseFloat(c.Saldo_Pendiente.toString()), 0,
    );

    const manager = this.notaRepo.manager;

    const result = await manager.query(
      `SELECT SUM("Stock_Actual" * "PrecioUnitario") as capital FROM "ProductoAlmacen" pa JOIN "Producto" p ON p."ID_Producto" = pa."ID_Producto"`,
    );
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
      pieData: rawStats.map((r: any) => ({ ...r, value: parseFloat(r.value) })),
      barData: dspStats,
    };
  }
}