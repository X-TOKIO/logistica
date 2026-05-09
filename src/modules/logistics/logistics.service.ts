import { Injectable, BadRequestException, NotFoundException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { NotaEgreso } from '../inventory/entities/nota-egreso.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Ruta } from './entities/ruta.entity';
import { Camion } from './entities/camion.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Despacho } from './entities/despacho.entity';
import { DespachoCamion } from './entities/despacho-camion.entity';
import { TrackingGPS } from './entities/tracking-gps.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { Almacen } from '../warehouse/entities/almacen.entity';

@Injectable()
export class LogisticsService implements OnApplicationBootstrap {
  private readonly logger = new Logger('LogisticsService');

  constructor(
    @InjectRepository(Sucursal) private sucRepo: Repository<Sucursal>,
    @InjectRepository(Ruta) private rutaRepo: Repository<Ruta>,
    @InjectRepository(Camion) private camRepo: Repository<Camion>,
    @InjectRepository(Vehiculo) private vehiculoRepo: Repository<Vehiculo>,
    @InjectRepository(Despacho) private desRepo: Repository<Despacho>,
    @InjectRepository(DespachoCamion) private dcRepo: Repository<DespachoCamion>,
    @InjectRepository(TrackingGPS) private trackRepo: Repository<TrackingGPS>,
    @InjectRepository(NotaEgreso) private egrRepo: Repository<NotaEgreso>,
    @InjectRepository(Usuario) private usrRepo: Repository<Usuario>,
    @InjectRepository(Almacen) private almRepo: Repository<Almacen>,
    private dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Inyectando Seed de Logística Base...');

    const choferUsr = await this.usrRepo.findOne({ where: { UserName: 'admin' } });
    if (choferUsr) {
       let camion = await this.camRepo.findOne({ where: { Placa: 'PAR-1234' } });
       if (!camion) await this.camRepo.save({
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

    // Merge catalog vehiculos, skipping duplicates by placa (camion table takes precedence)
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

  async createDespacho(dto: any) {
    if (!dto.ID_Egreso || !dto.ID_Ruta || !dto.ID_Camion)
      throw new BadRequestException('Faltan relaciones lógicas para armar el despacho.');

    // Resolve vehicle BEFORE starting the transaction so FK errors surface early
    let camionId = Number(dto.ID_Camion);
    const camionExists = await this.camRepo.findOne({ where: { ID_Camion: camionId } });
    if (!camionExists) {
      const vehiculo = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: camionId } });
      if (!vehiculo) throw new BadRequestException(`Vehículo ID ${camionId} no encontrado en ningún catálogo.`);

      const existByPlaca = await this.camRepo.findOne({ where: { Placa: vehiculo.Placa } });
      if (existByPlaca) {
        camionId = existByPlaca.ID_Camion;
      } else {
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

    const salida  = dto.FechaHora_Salida            ? new Date(dto.FechaHora_Salida)            : new Date();
    const entrega = dto.FechaHora_Estimada_Entrega   ? new Date(dto.FechaHora_Estimada_Entrega)  : new Date(salida.getTime() + 24 * 60 * 60 * 1000);

    // Atomic: both Despacho and DespachoCamion are created together or not at all
    return this.dataSource.transaction(async (qr) => {
      const desp = await qr.save(Despacho, {
        FechaSalida: salida,
        FechaEntregaEstimada: entrega,
        FechaHora_Salida: salida,
        FechaHora_Estimada_Entrega: entrega,
        ID_Egreso: dto.ID_Egreso,
        ID_Ruta:   dto.ID_Ruta,
      });

      await qr.save(DespachoCamion, {
        ID_Despacho: desp.ID_Despacho,
        ID_Camion:   camionId,
        EstadoDeEnvio: 'EN TRÁNSITO',
      });

      return desp;
    });
  }

  async getDespachosActivos(userId: number, roles: string[]) {
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

  async getHistorial(userId?: number, roles?: string[]) {
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

  async addTracking(dto: any) {
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

  async updateDespachoProgreso(id: number, progreso: number, estado: string) {
    const validStates = ['PENDIENTE', 'EN_RUTA', 'DETENIDO', 'ENTREGADO'];
    if (!validStates.includes(estado)) throw new BadRequestException(`Estado inválido. Use: ${validStates.join(', ')}`);

    const updateData: Record<string, any> = {
      Progreso_Porcentaje: Math.min(Math.max(progreso, 0), 1),
      Estado_Despacho: estado,
    };

    // Stamp server-side ms timestamp whenever the truck is actively en route
    // so the frontend can compute offline elapsed time on remount.
    if (estado === 'EN_RUTA') {
      updateData.Ultima_Actualizacion_Ms = Date.now();
    }

    await this.desRepo.update({ ID_Despacho: id }, updateData);

    if (estado === 'ENTREGADO') {
      await this.dcRepo.update({ ID_Despacho: id }, { EstadoDeEnvio: 'ENTREGADO' });
    }

    return { ok: true, ID_Despacho: id, progreso, estado };
  }

  async updateVehicleEstado(camionId: number, estado: string) {
    const valid = ['DISPONIBLE', 'EN_RUTA', 'MANTENIMIENTO'];
    if (!valid.includes(estado)) throw new BadRequestException(`Estado inválido. Use: ${valid.join(', ')}`);

    const camion = await this.camRepo.findOne({ where: { ID_Camion: camionId } });
    if (!camion) throw new NotFoundException(`Camión #${camionId} no encontrado.`);

    await this.camRepo.update({ ID_Camion: camionId }, { Estado: estado });
    await this.vehiculoRepo.update({ Placa: camion.Placa }, { Estado: estado });

    return { ok: true, ID_Camion: camionId, estado };
  }
}
