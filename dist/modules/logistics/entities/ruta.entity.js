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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruta = void 0;
const typeorm_1 = require("typeorm");
const almacen_entity_1 = require("../../warehouse/entities/almacen.entity");
const sucursal_entity_1 = require("./sucursal.entity");
let Ruta = class Ruta {
    ID_Ruta;
    Nombre_Ruta;
    Origen;
    Destino;
    Distancia_KM;
    Tiempo_Estimado_Horas;
    LatitudOrigen;
    LongitudOrigen;
    LatitudDestino;
    LongitudDestino;
    ID_Almacen;
    ID_Sucursal;
    almacen;
    sucursal;
    deleted_at;
};
exports.Ruta = Ruta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Ruta' }),
    __metadata("design:type", Number)
], Ruta.prototype, "ID_Ruta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Nombre_Ruta', length: 200, nullable: true }),
    __metadata("design:type", String)
], Ruta.prototype, "Nombre_Ruta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Origen', length: 300, nullable: true }),
    __metadata("design:type", String)
], Ruta.prototype, "Origen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Destino', length: 300, nullable: true }),
    __metadata("design:type", String)
], Ruta.prototype, "Destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Distancia_KM', type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "Distancia_KM", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Tiempo_Estimado_Horas', type: 'decimal', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "Tiempo_Estimado_Horas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LatitudOrigen', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "LatitudOrigen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LongitudOrigen', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "LongitudOrigen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LatitudDestino', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "LatitudDestino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LongitudDestino', type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "LongitudDestino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Almacen', nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "ID_Almacen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Sucursal', nullable: true }),
    __metadata("design:type", Number)
], Ruta.prototype, "ID_Sucursal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => almacen_entity_1.Almacen, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Almacen' }),
    __metadata("design:type", almacen_entity_1.Almacen)
], Ruta.prototype, "almacen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sucursal_entity_1.Sucursal, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Sucursal' }),
    __metadata("design:type", sucursal_entity_1.Sucursal)
], Ruta.prototype, "sucursal", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Ruta.prototype, "deleted_at", void 0);
exports.Ruta = Ruta = __decorate([
    (0, typeorm_1.Entity)('Ruta')
], Ruta);
//# sourceMappingURL=ruta.entity.js.map