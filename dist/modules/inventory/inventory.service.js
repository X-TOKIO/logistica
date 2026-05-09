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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
const nota_ingreso_entity_1 = require("./entities/nota-ingreso.entity");
const detalle_ingreso_entity_1 = require("./entities/detalle-ingreso.entity");
const nota_egreso_entity_1 = require("./entities/nota-egreso.entity");
const detalle_egreso_entity_1 = require("./entities/detalle-egreso.entity");
const mermas_entity_1 = require("./entities/mermas.entity");
const detalle_merma_entity_1 = require("./entities/detalle-merma.entity");
const almacen_entity_1 = require("../warehouse/entities/almacen.entity");
const producto_almacen_entity_1 = require("../warehouse/entities/producto-almacen.entity");
const producto_entity_1 = require("../warehouse/entities/producto.entity");
const nota_compra_entity_1 = require("../payments/entities/nota-compra.entity");
const proveedor_entity_1 = require("../payments/entities/proveedor.entity");
let InventoryService = class InventoryService {
    dataSource;
    ingRepo;
    egrRepo;
    mermaRepo;
    provRepo;
    compraRepo;
    constructor(dataSource, ingRepo, egrRepo, mermaRepo, provRepo, compraRepo) {
        this.dataSource = dataSource;
        this.ingRepo = ingRepo;
        this.egrRepo = egrRepo;
        this.mermaRepo = mermaRepo;
        this.provRepo = provRepo;
        this.compraRepo = compraRepo;
    }
    async onApplicationBootstrap() {
        return;
    }
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
    async registrarIngreso(dto, userId) {
        const usuario = await this.dataSource.manager.findOne(usuario_entity_1.Usuario, {
            where: { ID_Usuario: userId },
            select: { ID_Empleado: true },
        });
        if (!usuario)
            throw new common_1.BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
        const idEmpleado = usuario.ID_Empleado;
        const idCompra = dto.ID_Compra ?? undefined;
        if (idCompra) {
            const compra = await this.compraRepo.findOne({ where: { ID_Compra: idCompra } });
            if (!compra)
                throw new common_1.BadRequestException(`No se encontró la Compra #${idCompra}.`);
            if (compra.Nro_Factura) {
                const count = await this.ingRepo
                    .createQueryBuilder('ni')
                    .innerJoin('ni.compra', 'c')
                    .where('c.Nro_Factura = :factura', { factura: compra.Nro_Factura })
                    .getCount();
                if (count > 0) {
                    throw new common_1.ConflictException(`La Factura #${compra.Nro_Factura} ya fue procesada anteriormente. No se permiten duplicados.`);
                }
            }
            else {
                const existente = await this.ingRepo.findOne({ where: { ID_Compra: idCompra } });
                if (existente) {
                    throw new common_1.ConflictException(`La Compra #${idCompra} ya tiene un ingreso registrado (INC-${String(existente.ID_Ingreso).padStart(5, '0')}). No se permiten duplicados.`);
                }
            }
        }
        const almacenRepo = this.dataSource.getRepository(almacen_entity_1.Almacen);
        const productoRepo = this.dataSource.getRepository(producto_entity_1.Producto);
        for (const det of dto.detalles) {
            const almacen = await almacenRepo.findOne({ where: { ID_Almacen: Number(det.ID_Almacen) } });
            if (!almacen) {
                throw new common_1.BadRequestException(`El Almacén ID=${det.ID_Almacen} no existe. Verifica la selección.`);
            }
            const producto = await productoRepo.findOne({ where: { ID_Producto: Number(det.ID_Producto) } });
            if (!producto) {
                throw new common_1.BadRequestException(`El Producto ID=${det.ID_Producto} no existe en el catálogo.`);
            }
        }
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();
            const hora = dto.Hora ?? this.horaActual(new Date());
            const nota = qr.manager.create(nota_ingreso_entity_1.NotaIngreso, {
                Fecha: ahora,
                Hora: hora,
                Descripcion: dto.Descripcion ?? 'Ingreso registrado',
                Nombre: 'Recepción Logística',
                ID_Compra: idCompra,
                ID_Empleado: idEmpleado,
            });
            const notaGuardada = await qr.manager.save(nota);
            for (const det of dto.detalles) {
                const pivot = await qr.manager.findOne(producto_almacen_entity_1.ProductoAlmacen, {
                    where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
                });
                if (pivot) {
                    pivot.Stock_Actual =
                        parseFloat(pivot.Stock_Actual.toString()) + parseFloat(det.Cantidad.toString());
                    await qr.manager.save(pivot);
                }
                else {
                    await qr.manager.save(producto_almacen_entity_1.ProductoAlmacen, {
                        ID_Producto: det.ID_Producto,
                        ID_Almacen: det.ID_Almacen,
                        Stock_Actual: det.Cantidad,
                    });
                }
                await qr.manager.save(qr.manager.create(detalle_ingreso_entity_1.DetalleIngreso, {
                    ID_Ingreso: notaGuardada.ID_Ingreso,
                    ID_Producto: det.ID_Producto,
                    ID_Almacen: det.ID_Almacen,
                    Cantidad: det.Cantidad,
                }));
            }
            await qr.commitTransaction();
            return { status: 'success', ID_Ingreso: notaGuardada.ID_Ingreso };
        }
        catch (err) {
            await qr.rollbackTransaction();
            if (err instanceof typeorm_2.QueryFailedError) {
                const code = err.code ?? '';
                const sql = err.sqlMessage ?? err.message ?? '';
                if (code === 'ER_DUP_ENTRY' || code === '23505' || /duplicate|UNIQUE/i.test(sql)) {
                    throw new common_1.ConflictException('Registro duplicado: ya existe un ingreso con esos datos.');
                }
                throw new common_1.BadRequestException(`Error al guardar el ingreso: ${sql}`);
            }
            throw err;
        }
        finally {
            await qr.release();
        }
    }
    async registrarEgreso(dto, userId) {
        const usuario = await this.dataSource.manager.findOne(usuario_entity_1.Usuario, {
            where: { ID_Usuario: userId },
            select: { ID_Empleado: true },
        });
        if (!usuario)
            throw new common_1.BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
        const idEmpleado = usuario.ID_Empleado;
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();
            const hora = dto.Hora ?? this.horaActual(new Date());
            let montoTotal = 0;
            for (const det of dto.detalles) {
                const idProducto = parseInt(String(det.ID_Producto), 10);
                const idAlmacen = parseInt(String(det.ID_Almacen), 10);
                console.log(`[EGRESO DEBUG] Validando ítem: ID_Producto=${idProducto} (raw: ${det.ID_Producto}, tipo: ${typeof det.ID_Producto}), ` +
                    `ID_Almacen=${idAlmacen} (raw: ${det.ID_Almacen}, tipo: ${typeof det.ID_Almacen}), Cantidad=${det.Cantidad}`);
                const pivot = await qr.manager.findOne(producto_almacen_entity_1.ProductoAlmacen, {
                    where: { ID_Producto: idProducto, ID_Almacen: idAlmacen },
                });
                console.log(`[EGRESO DEBUG] Pivot encontrado: ${pivot ? `Stock_Actual=${pivot.Stock_Actual}` : 'null — registro NO encontrado en ProductoAlmacen'}`);
                const stockActual = pivot ? parseFloat(pivot.Stock_Actual.toString()) : 0;
                if (stockActual < parseFloat(det.Cantidad.toString())) {
                    const producto = await qr.manager.findOne(producto_entity_1.Producto, {
                        where: { ID_Producto: idProducto },
                    });
                    throw new common_1.BadRequestException(`Stock insuficiente para "${producto?.Nombre ?? `Producto ${det.ID_Producto}`}". ` +
                        `Disponible: ${stockActual}, solicitado: ${det.Cantidad}. ` +
                        `(Almacén buscado: ID=${idAlmacen})`);
                }
            }
            const nota = qr.manager.create(nota_egreso_entity_1.NotaEgreso, {
                Fecha: ahora,
                Hora: hora,
                Descripcion: dto.Descripcion ?? 'Egreso para distribución',
                MontoTotal: 0,
                ID_Empleado: idEmpleado,
            });
            const notaGuardada = await qr.manager.save(nota);
            for (const det of dto.detalles) {
                const idProducto = parseInt(String(det.ID_Producto), 10);
                const idAlmacen = parseInt(String(det.ID_Almacen), 10);
                const pivot = await qr.manager.findOne(producto_almacen_entity_1.ProductoAlmacen, {
                    where: { ID_Producto: idProducto, ID_Almacen: idAlmacen },
                });
                pivot.Stock_Actual =
                    parseFloat(pivot.Stock_Actual.toString()) - parseFloat(det.Cantidad.toString());
                await qr.manager.save(pivot);
                const producto = await qr.manager.findOne(producto_entity_1.Producto, {
                    where: { ID_Producto: idProducto },
                });
                montoTotal +=
                    parseFloat(producto.PrecioUnitario.toString()) * parseFloat(det.Cantidad.toString());
                await qr.manager.save(qr.manager.create(detalle_egreso_entity_1.DetalleEgreso, {
                    ID_Egreso: notaGuardada.ID_Egreso,
                    ID_Producto: idProducto,
                    ID_Almacen: idAlmacen,
                    ID_Sucursal: det.ID_Sucursal ?? undefined,
                    Cantidad: det.Cantidad,
                }));
            }
            notaGuardada.MontoTotal = montoTotal;
            await qr.manager.save(notaGuardada);
            await qr.commitTransaction();
            return { status: 'success', ID_Egreso: notaGuardada.ID_Egreso, MontoTotal: montoTotal };
        }
        catch (err) {
            await qr.rollbackTransaction();
            throw err;
        }
        finally {
            await qr.release();
        }
    }
    async registrarMerma(dto, userId) {
        const usuario = await this.dataSource.manager.findOne(usuario_entity_1.Usuario, {
            where: { ID_Usuario: userId },
            select: { ID_Empleado: true },
        });
        if (!usuario)
            throw new common_1.BadRequestException('No se encontró empleado vinculado al usuario autenticado.');
        const idEmpleado = usuario.ID_Empleado;
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const ahora = dto.Fecha ? new Date(dto.Fecha) : new Date();
            for (const det of dto.detalles) {
                const pivot = await qr.manager.findOne(producto_almacen_entity_1.ProductoAlmacen, {
                    where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
                });
                const stockActual = pivot ? parseFloat(pivot.Stock_Actual.toString()) : 0;
                if (stockActual < parseFloat(det.Cantidad.toString())) {
                    const producto = await qr.manager.findOne(producto_entity_1.Producto, {
                        where: { ID_Producto: det.ID_Producto },
                    });
                    throw new common_1.BadRequestException(`Stock insuficiente para registrar merma de "${producto?.Nombre ?? `Producto ${det.ID_Producto}`}". ` +
                        `Disponible: ${stockActual}, merma indicada: ${det.Cantidad}.`);
                }
            }
            const merma = qr.manager.create(mermas_entity_1.Mermas, {
                Fecha: ahora,
                MotivoPerdida: dto.MotivoPerdida,
                ID_Empleado: idEmpleado,
            });
            const mermaGuardada = await qr.manager.save(merma);
            for (const det of dto.detalles) {
                await qr.manager.save(qr.manager.create(detalle_merma_entity_1.DetalleMerma, {
                    ID_Merma: mermaGuardada.ID_Merma,
                    ID_Producto: det.ID_Producto,
                    ID_Almacen: det.ID_Almacen,
                    Cantidad: det.Cantidad,
                }));
                const pivot = await qr.manager.findOne(producto_almacen_entity_1.ProductoAlmacen, {
                    where: { ID_Producto: det.ID_Producto, ID_Almacen: det.ID_Almacen },
                });
                pivot.Stock_Actual =
                    parseFloat(pivot.Stock_Actual.toString()) - parseFloat(det.Cantidad.toString());
                await qr.manager.save(pivot);
            }
            await qr.commitTransaction();
            return { status: 'success', ID_Merma: mermaGuardada.ID_Merma };
        }
        catch (err) {
            await qr.rollbackTransaction();
            throw err;
        }
        finally {
            await qr.release();
        }
    }
    horaActual(date) {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}:00`;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(nota_ingreso_entity_1.NotaIngreso)),
    __param(2, (0, typeorm_1.InjectRepository)(nota_egreso_entity_1.NotaEgreso)),
    __param(3, (0, typeorm_1.InjectRepository)(mermas_entity_1.Mermas)),
    __param(4, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __param(5, (0, typeorm_1.InjectRepository)(nota_compra_entity_1.NotaCompra)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map