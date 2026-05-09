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
exports.Despacho = void 0;
const typeorm_1 = require("typeorm");
const nota_egreso_entity_1 = require("../../inventory/entities/nota-egreso.entity");
const ruta_entity_1 = require("./ruta.entity");
const tracking_gps_entity_1 = require("./tracking-gps.entity");
let Despacho = class Despacho {
    ID_Despacho;
    FechaSalida;
    FechaEntregaEstimada;
    FechaHora_Salida;
    FechaHora_Estimada_Entrega;
    ID_Egreso;
    ID_Ruta;
    Estado_Despacho;
    Progreso_Porcentaje;
    Ultima_Actualizacion_Ms;
    notaEgreso;
    ruta;
    trackings;
    deleted_at;
};
exports.Despacho = Despacho;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Despacho' }),
    __metadata("design:type", Number)
], Despacho.prototype, "ID_Despacho", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaSalida', type: 'date' }),
    __metadata("design:type", Date)
], Despacho.prototype, "FechaSalida", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaEntregaEstimada', type: 'date' }),
    __metadata("design:type", Date)
], Despacho.prototype, "FechaEntregaEstimada", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaHora_Salida', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Despacho.prototype, "FechaHora_Salida", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaHora_Estimada_Entrega', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Despacho.prototype, "FechaHora_Estimada_Entrega", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Egreso' }),
    __metadata("design:type", Number)
], Despacho.prototype, "ID_Egreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Ruta' }),
    __metadata("design:type", Number)
], Despacho.prototype, "ID_Ruta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Estado_Despacho', length: 20, default: 'PENDIENTE' }),
    __metadata("design:type", String)
], Despacho.prototype, "Estado_Despacho", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Progreso_Porcentaje', type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Despacho.prototype, "Progreso_Porcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Ultima_Actualizacion_Ms', type: 'float', nullable: true }),
    __metadata("design:type", Object)
], Despacho.prototype, "Ultima_Actualizacion_Ms", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nota_egreso_entity_1.NotaEgreso),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Egreso' }),
    __metadata("design:type", nota_egreso_entity_1.NotaEgreso)
], Despacho.prototype, "notaEgreso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ruta_entity_1.Ruta),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Ruta' }),
    __metadata("design:type", ruta_entity_1.Ruta)
], Despacho.prototype, "ruta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tracking_gps_entity_1.TrackingGPS, tracking => tracking.despacho),
    __metadata("design:type", Array)
], Despacho.prototype, "trackings", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Despacho.prototype, "deleted_at", void 0);
exports.Despacho = Despacho = __decorate([
    (0, typeorm_1.Entity)('Despacho')
], Despacho);
//# sourceMappingURL=despacho.entity.js.map