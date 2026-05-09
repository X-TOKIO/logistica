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
exports.LogisticsCatalogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proveedor_entity_1 = require("../payments/entities/proveedor.entity");
const vehiculo_entity_1 = require("./entities/vehiculo.entity");
const ruta_entity_1 = require("./entities/ruta.entity");
let LogisticsCatalogService = class LogisticsCatalogService {
    provRepo;
    vehiculoRepo;
    rutaRepo;
    constructor(provRepo, vehiculoRepo, rutaRepo) {
        this.provRepo = provRepo;
        this.vehiculoRepo = vehiculoRepo;
        this.rutaRepo = rutaRepo;
    }
    getProveedores() {
        return this.provRepo.find({ order: { ID_Proveedor: 'DESC' } });
    }
    async createProveedor(dto) {
        if (!dto.Nombre_RazonSocial || !dto.NIT) {
            throw new common_1.BadRequestException('Nombre/Razón Social y NIT son requeridos.');
        }
        const existing = await this.provRepo.findOne({ where: { NIT: dto.NIT } });
        if (existing)
            throw new common_1.BadRequestException(`Ya existe un proveedor con NIT ${dto.NIT}.`);
        return this.provRepo.save({ ...dto, Estado: dto.Estado || 'ACTIVO' });
    }
    async updateProveedor(id, dto) {
        const prov = await this.provRepo.findOne({ where: { ID_Proveedor: id } });
        if (!prov)
            throw new common_1.NotFoundException(`Proveedor ID ${id} no encontrado.`);
        return this.provRepo.save({ ...prov, ...dto });
    }
    async removeProveedor(id) {
        const prov = await this.provRepo.findOne({ where: { ID_Proveedor: id } });
        if (!prov)
            throw new common_1.NotFoundException(`Proveedor ID ${id} no encontrado.`);
        await this.provRepo.softDelete(id);
        return { message: 'Proveedor desactivado correctamente.' };
    }
    getVehiculos() {
        return this.vehiculoRepo.find({ relations: ['empleado'], order: { ID_Vehiculo: 'DESC' } });
    }
    async createVehiculo(dto) {
        if (!dto.Placa || !dto.Marca || !dto.Modelo) {
            throw new common_1.BadRequestException('Placa, Marca y Modelo son requeridos.');
        }
        const existing = await this.vehiculoRepo.findOne({ where: { Placa: dto.Placa } });
        if (existing)
            throw new common_1.BadRequestException(`Ya existe un vehículo con placa ${dto.Placa}.`);
        return this.vehiculoRepo.save({ ...dto, Estado: dto.Estado || 'DISPONIBLE' });
    }
    async updateVehiculo(id, dto) {
        const veh = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: id } });
        if (!veh)
            throw new common_1.NotFoundException(`Vehículo ID ${id} no encontrado.`);
        return this.vehiculoRepo.save({ ...veh, ...dto });
    }
    async removeVehiculo(id) {
        const veh = await this.vehiculoRepo.findOne({ where: { ID_Vehiculo: id } });
        if (!veh)
            throw new common_1.NotFoundException(`Vehículo ID ${id} no encontrado.`);
        await this.vehiculoRepo.softDelete(id);
        return { message: 'Vehículo eliminado correctamente.' };
    }
    getRutas() {
        return this.rutaRepo.find({ order: { ID_Ruta: 'DESC' } });
    }
    async createRuta(dto) {
        if (!dto.Nombre_Ruta || !dto.Origen || !dto.Destino) {
            throw new common_1.BadRequestException('Nombre de ruta, Origen y Destino son requeridos.');
        }
        return this.rutaRepo.save(dto);
    }
    async updateRuta(id, dto) {
        const ruta = await this.rutaRepo.findOne({ where: { ID_Ruta: id } });
        if (!ruta)
            throw new common_1.NotFoundException(`Ruta ID ${id} no encontrada.`);
        return this.rutaRepo.save({ ...ruta, ...dto });
    }
    async removeRuta(id) {
        const ruta = await this.rutaRepo.findOne({ where: { ID_Ruta: id } });
        if (!ruta)
            throw new common_1.NotFoundException(`Ruta ID ${id} no encontrada.`);
        await this.rutaRepo.softDelete(id);
        return { message: 'Ruta eliminada correctamente.' };
    }
};
exports.LogisticsCatalogService = LogisticsCatalogService;
exports.LogisticsCatalogService = LogisticsCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __param(1, (0, typeorm_1.InjectRepository)(vehiculo_entity_1.Vehiculo)),
    __param(2, (0, typeorm_1.InjectRepository)(ruta_entity_1.Ruta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LogisticsCatalogService);
//# sourceMappingURL=logistics-catalog.service.js.map