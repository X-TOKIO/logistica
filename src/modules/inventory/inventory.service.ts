import { BadRequestException, ConflictException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';

import { Usuario } from '../auth/entities/usuario.entity';
import { NotaIngreso } from './entities/nota-ingreso.entity';
import { DetalleIngreso } from './entities/detalle-ingreso.entity';
import { NotaEgreso } from './entities/nota-egreso.entity';
import { DetalleEgreso } from './entities/detalle-egreso.entity';
import { Mermas } from './entities/mermas.entity';
import { DetalleMerma } from './entities/detalle-merma.entity';
import { Almacen } from '../warehouse/entities/almacen.entity';
import { ProductoAlmacen } from '../warehouse/entities/producto-almacen.entity';
import { Producto } from '../warehouse/entities/producto.entity';
import { NotaCompra } from '../payments/entities/nota-compra.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';

import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { CreateMermaDto } from './dto/create-merma.dto';

@Injectable()
export class InventoryService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(NotaIngreso) private readonly ingRepo: Repository<NotaIngreso>,
    @InjectRepository(NotaEgreso) private readonly egrRepo: Repository<NotaEgreso>,
    @InjectRepository(Mermas) private readonly mermaRepo: Repository<Mermas>,
    @InjectRepository(Proveedor) private readonly provRepo: Repository<Proveedor>,
    @InjectRepository(NotaCompra) private readonly compraRepo: Repository<NotaCompra>,
  ) { }

  // ── Seed ─────────────────────────────────────────────────────────────────────
  async onApplicationBootstrap() {
    // Se elimina la creación de datos dummy porque ya tenemos el módulo 
    // de Proveedores funcional y esto causaba el error de llave duplicada.
    return;
  }

  // ── Consultas ─────────────────────────────────────────────────────────────────

  getIngresos() {
    return this.ingRepo
      .createQueryBuilder('ni')
      .leftJoinAndSelect('ni.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      .leftJoinAndSelect('ni.compra', 'compra')
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('ni.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .leftJoinAndSelect('producto.medida', 'medida')
      .orderBy('ni.Fecha', 'DESC')
      .getMany();
  }

  getEgresos() {
    return this.egrRepo
      .createQueryBuilder('ne')
      .leftJoinAndSelect('ne.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      .leftJoinAndSelect('ne.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .leftJoinAndSelect('producto.medida', 'medida')
      .leftJoinAndSelect('detalles.sucursal', 'sucursal')
      .orderBy('ne.Fecha', 'DESC')
      .getMany();
  }

  getMermas() {
    return this.mermaRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      .leftJoinAndSelect('m.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .leftJoinAndSelect('producto.medida', 'medida')
      .orderBy('m.Fecha', 'DESC')
      .getMany();
  }

  // ── registrarIngreso ──────────────────────────────────────────────────────────

  async registrarIngreso(dto: CreateIngresoDto, userId: number) {

    // ── 1. Resolver empleado ──────────────────────────────────────────────────
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { ID_Usuario: userId },
      select: { ID_Empleado: true },
    });
    if (!usuario) throw new BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
    const idEmpleado = usuario.ID_Empleado;

    const idCompra: number | undefined = dto.ID_Compra ?? undefined;

    // ── 2. Validar factura única ANTES de la transacción ─────────────────────
    if (idCompra) {
      const compra = await this.compraRepo.findOne({ where: { ID_Compra: idCompra } });
      if (!compra) throw new BadRequestException(`No se encontró la Compra #${idCompra}.`);

      if (compra.Nro_Factura) {
        const count = await this.ingRepo
          .createQueryBuilder('ni')
          .innerJoin('ni.compra', 'c')
          .where('c.Nro_Factura = :factura', { factura: compra.Nro_Factura })
          .getCount();

        if (count > 0) {
          throw new ConflictException(
            `La Factura #${compra.Nro_Factura} ya fue procesada anteriormente. No se permiten duplicados.`,
          );
        }
      } else {
        const existente = await this.ingRepo.findOne({ where: { ID_Compra: idCompra } });
        if (existente) {
          throw new ConflictException(
            `La Compra #${idCompra} ya tiene un ingreso registrado (INC-${String(existente.ID_Ingreso).padStart(5, '0')}). No se permiten duplicados.`,
          );
        }
      }
    }

    // ── 3. Verificar existencia de Almacén y Producto ANTES de la transacción ─
    const almacenRepo  = this.dataSource.getRepository(Almacen);
    const productoRepo = this.dataSource.getRepository(Producto);

    for (const det of dto.detalles) {
      const almacen = await almacenRepo.findOne({ where: { ID_Almacen: Number(det.ID_Almacen) } });
      if (!almacen) {
        throw new BadRequestException(`El Almacén ID=${det.ID_Almacen} no existe. Verifica la selección.`);
      }

      const producto = await productoRepo.findOne({ where: { ID_Producto: Number(det.ID_Producto) } });
      if (!producto) {
        throw new BadRequestException(`El Producto ID=${det.ID_Producto} no existe en el catálogo.`);
      }
    }

    // ── 4. Transacción: pivot PRIMERO, luego detalle (evita FK violation) ─────
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();
      const hora  = dto.Hora ?? this.horaActual(new Date());

      // 4-a. Guardar encabezado — su ID generado se necesita para los detalles
      const nota = qr.manager.create(NotaIngreso, {
        Fecha: ahora,
        Hora: hora,
        Descripcion: dto.Descripcion ?? 'Ingreso registrado',
        Nombre: 'Recepción Logística',
        ID_Compra: idCompra,
        ID_Empleado: idEmpleado,
      });
      const notaGuardada = await qr.manager.save(nota);

      for (const det of dto.detalles) {
        // 4-b. Upsert ProductoAlmacen PRIMERO — satisface la FK de DetalleIngreso
        const pivot = await qr.manager.findOne(ProductoAlmacen, {
          where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
        });

        if (pivot) {
          pivot.Stock_Actual =
            parseFloat(pivot.Stock_Actual.toString()) + parseFloat(det.Cantidad.toString());
          await qr.manager.save(pivot);
        } else {
          await qr.manager.save(ProductoAlmacen, {
            ID_Producto: det.ID_Producto,
            ID_Almacen:  det.ID_Almacen,
            Stock_Actual: det.Cantidad,
          });
        }

        // 4-c. Insertar DetalleIngreso — el pivot ya existe, FK satisfecha
        await qr.manager.save(
          qr.manager.create(DetalleIngreso, {
            ID_Ingreso:  notaGuardada.ID_Ingreso,
            ID_Producto: det.ID_Producto,
            ID_Almacen:  det.ID_Almacen,
            Cantidad:    det.Cantidad,
          }),
        );
      }

      await qr.commitTransaction();
      return { status: 'success', ID_Ingreso: notaGuardada.ID_Ingreso };

    } catch (err) {
      await qr.rollbackTransaction();
      if (err instanceof QueryFailedError) {
        const code = (err as any).code ?? '';
        const sql  = (err as any).sqlMessage ?? (err as any).message ?? '';
        if (code === 'ER_DUP_ENTRY' || code === '23505' || /duplicate|UNIQUE/i.test(sql)) {
          throw new ConflictException('Registro duplicado: ya existe un ingreso con esos datos.');
        }
        throw new BadRequestException(`Error al guardar el ingreso: ${sql}`);
      }
      throw err;
    } finally {
      await qr.release();
    }
  }

  // ── registrarEgreso ───────────────────────────────────────────────────────────

  async registrarEgreso(dto: CreateEgresoDto, userId: number) {
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { ID_Usuario: userId },
      select: { ID_Empleado: true },
    });
    if (!usuario) throw new BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
    const idEmpleado = usuario.ID_Empleado;

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Usa la fecha/hora del DTO si el frontend las provee; si no, genera la actual
      const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();
      const hora = dto.Hora ?? this.horaActual(new Date());

      let montoTotal = 0;

      // Validar stock de todos los ítems antes de modificar nada
      for (const det of dto.detalles) {
        const idProducto = parseInt(String(det.ID_Producto), 10);
        const idAlmacen  = parseInt(String(det.ID_Almacen),  10);

        console.log(
          `[EGRESO DEBUG] Validando ítem: ID_Producto=${idProducto} (raw: ${det.ID_Producto}, tipo: ${typeof det.ID_Producto}), ` +
          `ID_Almacen=${idAlmacen} (raw: ${det.ID_Almacen}, tipo: ${typeof det.ID_Almacen}), Cantidad=${det.Cantidad}`,
        );

        const pivot = await qr.manager.findOne(ProductoAlmacen, {
          where: { ID_Producto: idProducto, ID_Almacen: idAlmacen },
        });

        console.log(
          `[EGRESO DEBUG] Pivot encontrado: ${pivot ? `Stock_Actual=${pivot.Stock_Actual}` : 'null — registro NO encontrado en ProductoAlmacen'}`,
        );

        const stockActual = pivot ? parseFloat(pivot.Stock_Actual.toString()) : 0;

        if (stockActual < parseFloat(det.Cantidad.toString())) {
          const producto = await qr.manager.findOne(Producto, {
            where: { ID_Producto: idProducto },
          });
          throw new BadRequestException(
            `Stock insuficiente para "${producto?.Nombre ?? `Producto ${det.ID_Producto}`}". ` +
            `Disponible: ${stockActual}, solicitado: ${det.Cantidad}. ` +
            `(Almacén buscado: ID=${idAlmacen})`,
          );
        }
      }

      const nota = qr.manager.create(NotaEgreso, {
        Fecha: ahora,
        Hora: hora,
        Descripcion: dto.Descripcion ?? 'Egreso para distribución',
        MontoTotal: 0,
        ID_Empleado: idEmpleado,
      });
      const notaGuardada = await qr.manager.save(nota);

      for (const det of dto.detalles) {
        const idProducto = parseInt(String(det.ID_Producto), 10);
        const idAlmacen  = parseInt(String(det.ID_Almacen),  10);

        const pivot = await qr.manager.findOne(ProductoAlmacen, {
          where: { ID_Producto: idProducto, ID_Almacen: idAlmacen },
        });

        pivot!.Stock_Actual =
          parseFloat(pivot!.Stock_Actual.toString()) - parseFloat(det.Cantidad.toString());
        await qr.manager.save(pivot);

        const producto = await qr.manager.findOne(Producto, {
          where: { ID_Producto: idProducto },
        });
        montoTotal +=
          parseFloat(producto!.PrecioUnitario.toString()) * parseFloat(det.Cantidad.toString());

        await qr.manager.save(
          qr.manager.create(DetalleEgreso, {
            ID_Egreso:   notaGuardada.ID_Egreso,
            ID_Producto: idProducto,
            ID_Almacen:  idAlmacen,
            ID_Sucursal: det.ID_Sucursal ?? undefined,
            Cantidad:    det.Cantidad,
          }),
        );
      }

      notaGuardada.MontoTotal = montoTotal;
      await qr.manager.save(notaGuardada);

      await qr.commitTransaction();
      return { status: 'success', ID_Egreso: notaGuardada.ID_Egreso, MontoTotal: montoTotal };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // ── registrarMerma ────────────────────────────────────────────────────────────

  async registrarMerma(dto: CreateMermaDto, userId: number) {
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { ID_Usuario: userId },
      select: { ID_Empleado: true },
    });
    if (!usuario) throw new BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
    const idEmpleado = usuario.ID_Empleado;

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Usa la fecha del DTO si el frontend la provee; si no, genera la actual
      const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();

      // Validar stock antes de registrar pérdida
      for (const det of dto.detalles) {
        const pivot = await qr.manager.findOne(ProductoAlmacen, {
          where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
        });

        const stockActual = pivot ? parseFloat(pivot.Stock_Actual.toString()) : 0;

        if (stockActual < parseFloat(det.Cantidad.toString())) {
          const producto = await qr.manager.findOne(Producto, {
            where: { ID_Producto: det.ID_Producto },
          });
          throw new BadRequestException(
            `Stock insuficiente para registrar merma de "${producto?.Nombre ?? `Producto ${det.ID_Producto}`}". ` +
            `Disponible: ${stockActual}, merma indicada: ${det.Cantidad}.`,
          );
        }
      }

      const merma = qr.manager.create(Mermas, {
        Fecha: ahora,
        MotivoPerdida: dto.MotivoPerdida,
        ID_Empleado: idEmpleado,
      });
      const mermaGuardada = await qr.manager.save(merma);

      for (const det of dto.detalles) {
        await qr.manager.save(
          qr.manager.create(DetalleMerma, {
            ID_Merma: mermaGuardada.ID_Merma,
            ID_Producto: det.ID_Producto,
            ID_Almacen: det.ID_Almacen,
            Cantidad: det.Cantidad,
          }),
        );

        const pivot = await qr.manager.findOne(ProductoAlmacen, {
          where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
        });

        pivot!.Stock_Actual =
          parseFloat(pivot!.Stock_Actual.toString()) - parseFloat(det.Cantidad.toString());
        await qr.manager.save(pivot);
      }

      await qr.commitTransaction();
      return { status: 'success', ID_Merma: mermaGuardada.ID_Merma };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  private horaActual(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}:00`;
  }
}
