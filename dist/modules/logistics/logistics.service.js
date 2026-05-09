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
exports.LogisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nota_egreso_entity_1 = require("../inventory/entities/nota-egreso.entity");
const sucursal_entity_1 = require("./entities/sucursal.entity");
const ruta_entity_1 = require("./entities/ruta.entity");
const camion_entity_1 = require("./entities/camion.entity");
const vehiculo_entity_1 = require("./entities/vehiculo.entity");
const despacho_entity_1 = require("./entities/despacho.entity");
const despacho_camion_entity_1 = require("./entities/despacho-camion.entity");
const tracking_gps_entity_1 = require("./entities/tracking-gps.entity");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
const almacen_entity_1 = require("../warehouse/entities/almacen.entity");
let LogisticsService = class LogisticsService {
    sucRepo;
    rutaRepo;
    camRepo;
    vehiculoRepo;
    desRepo;
    dcRepo;
    trackRepo;
    egrRepo;
    usrRepo;
    almRepo;
    dataSource;
    logger = new common_1.Logger('LogisticsService');
    constructor(sucRepo, rutaRepo, camRepo, vehiculoRepo, desRepo, dcRepo, trackRepo, egrRepo, usrRepo, almRepo, dataSource) {
        this.sucRepo = sucRepo;
        this.rutaRepo = rutaRepo;
        this.camRepo = camRepo;
        this.vehiculoRepo = vehiculoRepo;
        this.desRepo = desRepo;
        this.dcRepo = dcRepo;
        this.trackRepo = trackRepo;
        this.egrRepo = egrRepo;
        this.usrRepo = usrRepo;
        this.almRepo = almRepo;
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        this.logger.log('Inyectando Seed de Logística Base...');
        const choferUsr = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
        if (choferUsr) {
            let camion = await this.camRepo.findOne({ where: { Placa: 'PAR-1234' } });
            if (!camion)
                await this.camRepo.save({
                    Placa: 'PAR-1234', Modelo: 'Volvo FMX 500', CapacidadCarga: 25000, Estado: 'DISPONIBLE', ID_Empleado: choferUsr.ID_Empleado
                });
        }
    }
    async getPendientes() {
        const egrActivos = await this.egrRepo.find({ relations: ['empleado'] });
        const despachos = await this.desRepo.find();
        const assignedIds = despachos.map(d => d.ID_Egreso);
        return egrActivos.filter(e => !assignedIds.includes(e.ID_Egreso));
    }
    async getRutas() { return this.rutaRepo.find({ relations: ['almacen', 'sucursal'] }); }
    async getCamiones() {
        const camiones = await this.camRepo.find({ relations: ['empleado'] });
        const vehiculos = await this.vehiculoRepo.find({ relations: ['empleado'] });
        const camionPlacas = new Set(camiones.map(c => c.Placa));
        const newVehiculos = vehiculos
            .filter(v => !camionPlacas.has(v.Placa))
            .map(v => ({
            ID_Camion: v.ID_Vehiculo,
            Placa: v.Placa,
            Modelo: [v.Marca, v.Modelo].filter(Boolean).join(' '),
            CapacidadCarga: v.Capacidad_Carga,
            Estado: v.Estado,
            ID_Empleado: v.ID_Empleado,
            empleado: v.empleado,
            _fromCatalog: true,
        }));
        return [...camiones, ...newVehiculos];
    }
    async createDespacho(dto) {
        if (!dto.ID_Egreso || !dto.ID_Ruta || !dto.ID_Camion)
            throw new common_1.BadRequestException('Faltan relaciones lógicas para armar el despacho.');
        let camionId = Number(dto.ID_Camion);
        const camionExists = await this.camRepo.findOne({ where: { ID_Camion: camionId } });
        if (!camionExists) {
            const vehiculo = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: camionId } });
            if (!vehiculo)
                throw new common_1.BadRequestException(`Vehículo ID ${camionId} no encontrado en ningún catálogo.`);
            const existByPlaca = await this.camRepo.findOne({ where: { Placa: vehiculo.Placa } });
            if (existByPlaca) {
                camionId = existByPlaca.ID_Camion;
            }
            else {
                const newCam = await this.camRepo.save({
                    Placa: vehiculo.Placa,
                    Modelo: [vehiculo.Marca, vehiculo.Modelo].filter(Boolean).join(' '),
                    CapacidadCarga: vehiculo.Capacidad_Carga || 0,
                    Estado: vehiculo.Estado || 'DISPONIBLE',
                    ID_Empleado: vehiculo.ID_Empleado || 1,
                });
                camionId = newCam.ID_Camion;
            }
        }
        const salida = dto.FechaHora_Salida ? new Date(dto.FechaHora_Salida) : new Date();
        const entrega = dto.FechaHora_Estimada_Entrega ? new Date(dto.FechaHora_Estimada_Entrega) : new Date(salida.getTime() + 24 * 60 * 60 * 1000);
        return this.dataSource.transaction(async (qr) => {
            const desp = await qr.save(despacho_entity_1.Despacho, {
                FechaSalida: salida,
                FechaEntregaEstimada: entrega,
                FechaHora_Salida: salida,
                FechaHora_Estimada_Entrega: entrega,
                ID_Egreso: dto.ID_Egreso,
                ID_Ruta: dto.ID_Ruta,
            });
            await qr.save(despacho_camion_entity_1.DespachoCamion, {
                ID_Despacho: desp.ID_Despacho,
                ID_Camion: camionId,
                EstadoDeEnvio: 'EN TRÁNSITO',
            });
            return desp;
        });
    }
    async getDespachosActivos(userId, roles) {
        let qb = this.dcRepo.createQueryBuilder('dc')
            .leftJoinAndSelect('dc.despacho', 'd')
            .leftJoinAndSelect('dc.camion', 'c')
            .leftJoinAndSelect('c.empleado', 'emp')
            .leftJoinAndSelect('d.ruta', 'r')
            .leftJoinAndSelect('r.sucursal', 's')
            .leftJoinAndSelect('r.almacen', 'a')
            .leftJoinAndSelect('d.notaEgreso', 'ne')
            .where("dc.EstadoDeEnvio != 'ENTREGADO'");
        if (!roles.includes('ADMINISTRADOR') && roles.includes('CHOFER')) {
            const usr = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
            qb.andWhere('c.ID_Empleado = :emp', { emp: usr?.ID_Empleado || 1 });
        }
        return qb.getMany();
    }
    async getHistorial(userId, roles) {
        const qb = this.dcRepo.createQueryBuilder('dc')
            .leftJoinAndSelect('dc.despacho', 'd')
            .leftJoinAndSelect('dc.camion', 'c')
            .leftJoinAndSelect('c.empleado', 'emp')
            .leftJoinAndSelect('d.ruta', 'r')
            .leftJoinAndSelect('r.sucursal', 's')
            .leftJoinAndSelect('r.almacen', 'a')
            .leftJoinAndSelect('d.notaEgreso', 'ne')
            .orderBy('d.ID_Despacho', 'DESC');
        if (userId && roles && !roles.includes('ADMINISTRADOR') && roles.includes('CHOFER')) {
            const usr = await this.usrRepo.findOne({ where: { ID_Usuario: userId } });
            qb.andWhere('c.ID_Empleado = :emp', { emp: usr?.ID_Empleado || 1 });
        }
        return qb.getMany();
    }
    async addTracking(dto) {
        return this.trackRepo.save({
            Latitud: dto.latitud, Longitud: dto.longitud,
            FechaHora: new Date(), ID_Despacho: dto.ID_Despacho
        });
    }
    async getLatestTracking() {
        const subquery = this.trackRepo.createQueryBuilder('t2')
            .select('MAX(t2.ID_Tracking)')
            .groupBy('t2.ID_Despacho');
        return this.trackRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.despacho', 'd')
            .leftJoinAndSelect('d.ruta', 'r')
            .leftJoinAndSelect('d.notaEgreso', 'ne')
            .where(`t.ID_Tracking IN (${subquery.getQuery()})`)
            .andWhere("d.Estado_Despacho = 'EN_RUTA'")
            .getMany();
    }
    async updateDespachoProgreso(id, progreso, estado) {
        const validStates = ['PENDIENTE', 'EN_RUTA', 'DETENIDO', 'ENTREGADO'];
        if (!validStates.includes(estado))
            throw new common_1.BadRequestException(`Estado inválido. Use: ${validStates.join(', ')}`);
        const updateData = {
            Progreso_Porcentaje: Math.min(Math.max(progreso, 0), 1),
            Estado_Despacho: estado,
        };
        if (estado === 'EN_RUTA') {
            updateData.Ultima_Actualizacion_Ms = Date.now();
        }
        await this.desRepo.update({ ID_Despacho: id }, updateData);
        if (estado === 'ENTREGADO') {
            await this.dcRepo.update({ ID_Despacho: id }, { EstadoDeEnvio: 'ENTREGADO' });
        }
        return { ok: true, ID_Despacho: id, progreso, estado };
    }
    async updateVehicleEstado(camionId, estado) {
        const valid = ['DISPONIBLE', 'EN_RUTA', 'MANTENIMIENTO'];
        if (!valid.includes(estado))
            throw new common_1.BadRequestException(`Estado inválido. Use: ${valid.join(', ')}`);
        const camion = await this.camRepo.findOne({ where: { ID_Camion: camionId } });
        if (!camion)
            throw new common_1.NotFoundException(`Camión #${camionId} no encontrado.`);
        await this.camRepo.update({ ID_Camion: camionId }, { Estado: estado });
        await this.vehiculoRepo.update({ Placa: camion.Placa }, { Estado: estado });
        return { ok: true, ID_Camion: camionId, estado };
    }
};
exports.LogisticsService = LogisticsService;
exports.LogisticsService = LogisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sucursal_entity_1.Sucursal)),
    __param(1, (0, typeorm_1.InjectRepository)(ruta_entity_1.Ruta)),
    __param(2, (0, typeorm_1.InjectRepository)(camion_entity_1.Camion)),
    __param(3, (0, typeorm_1.InjectRepository)(vehiculo_entity_1.Vehiculo)),
    __param(4, (0, typeorm_1.InjectRepository)(despacho_entity_1.Despacho)),
    __param(5, (0, typeorm_1.InjectRepository)(despacho_camion_entity_1.DespachoCamion)),
    __param(6, (0, typeorm_1.InjectRepository)(tracking_gps_entity_1.TrackingGPS)),
    __param(7, (0, typeorm_1.InjectRepository)(nota_egreso_entity_1.NotaEgreso)),
    __param(8, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(9, (0, typeorm_1.InjectRepository)(almacen_entity_1.Almacen)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LogisticsService);
//# sourceMappingURL=logistics.service.js.map