import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proveedor } from '../payments/entities/proveedor.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Ruta } from './entities/ruta.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { CreateRutaCatalogDto } from './dto/create-ruta-catalog.dto';
import { UpdateRutaCatalogDto } from './dto/update-ruta-catalog.dto';

@Injectable()
export class LogisticsCatalogService {

  constructor(
    @InjectRepository(Proveedor) private provRepo: Repository<Proveedor>,
    @InjectRepository(Vehiculo) private vehiculoRepo: Repository<Vehiculo>,
    @InjectRepository(Ruta) private rutaRepo: Repository<Ruta>,
  ) {}

  // ── Proveedores ────────────────────────────────────────────────────────────

  getProveedores() {
    return this.provRepo.find({ order: { ID_Proveedor: 'DESC' } });
  }

  async createProveedor(dto: CreateProveedorDto) {
    if (!dto.Nombre_RazonSocial || !dto.NIT) {
      throw new BadRequestException('Nombre/Razón Social y NIT son requeridos.');
    }
    const existing = await this.provRepo.findOne({ where: { NIT: dto.NIT } });
    if (existing) throw new BadRequestException(`Ya existe un proveedor con NIT ${dto.NIT}.`);
    return this.provRepo.save({ ...dto, Estado: dto.Estado || 'ACTIVO' });
  }

  async updateProveedor(id: number, dto: UpdateProveedorDto) {
    const prov = await this.provRepo.findOne({ where: { ID_Proveedor: id } });
    if (!prov) throw new NotFoundException(`Proveedor ID ${id} no encontrado.`);
    return this.provRepo.save({ ...prov, ...dto });
  }

  async removeProveedor(id: number) {
    const prov = await this.provRepo.findOne({ where: { ID_Proveedor: id } });
    if (!prov) throw new NotFoundException(`Proveedor ID ${id} no encontrado.`);
    await this.provRepo.softDelete(id);
    return { message: 'Proveedor desactivado correctamente.' };
  }

  // ── Vehículos ──────────────────────────────────────────────────────────────

  getVehiculos() {
    return this.vehiculoRepo.find({ relations: ['empleado'], order: { ID_Vehiculo: 'DESC' } });
  }

  async createVehiculo(dto: CreateVehiculoDto) {
    if (!dto.Placa || !dto.Marca || !dto.Modelo) {
      throw new BadRequestException('Placa, Marca y Modelo son requeridos.');
    }
    const existing = await this.vehiculoRepo.findOne({ where: { Placa: dto.Placa } });
    if (existing) throw new BadRequestException(`Ya existe un vehículo con placa ${dto.Placa}.`);
    return this.vehiculoRepo.save({ ...dto, Estado: dto.Estado || 'DISPONIBLE' });
  }

  async updateVehiculo(id: number, dto: UpdateVehiculoDto) {
    const veh = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: id } });
    if (!veh) throw new NotFoundException(`Vehículo ID ${id} no encontrado.`);
    return this.vehiculoRepo.save({ ...veh, ...dto });
  }

  async removeVehiculo(id: number) {
    const veh = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: id } });
    if (!veh) throw new NotFoundException(`Vehículo ID ${id} no encontrado.`);
    await this.vehiculoRepo.softDelete(id);
    return { message: 'Vehículo eliminado correctamente.' };
  }

  // ── Rutas ──────────────────────────────────────────────────────────────────

  getRutas() {
    return this.rutaRepo.find({ order: { ID_Ruta: 'DESC' } });
  }

  async createRuta(dto: CreateRutaCatalogDto) {
    if (!dto.Nombre_Ruta || !dto.Origen || !dto.Destino) {
      throw new BadRequestException('Nombre de ruta, Origen y Destino son requeridos.');
    }
    return this.rutaRepo.save(dto);
  }

  async updateRuta(id: number, dto: UpdateRutaCatalogDto) {
    const ruta = await this.rutaRepo.findOne({ where: { ID_Ruta: id } });
    if (!ruta) throw new NotFoundException(`Ruta ID ${id} no encontrada.`);
    return this.rutaRepo.save({ ...ruta, ...dto });
  }

  async removeRuta(id: number) {
    const ruta = await this.rutaRepo.findOne({ where: { ID_Ruta: id } });
    if (!ruta) throw new NotFoundException(`Ruta ID ${id} no encontrada.`);
    await this.rutaRepo.softDelete(id);
    return { message: 'Ruta eliminada correctamente.' };
  }
}
