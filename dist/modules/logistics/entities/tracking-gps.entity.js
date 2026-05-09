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
exports.TrackingGPS = void 0;
const typeorm_1 = require("typeorm");
const despacho_entity_1 = require("./despacho.entity");
let TrackingGPS = class TrackingGPS {
    ID_Tracking;
    Latitud;
    Longitud;
    FechaHora;
    ID_Despacho;
    despacho;
    deleted_at;
};
exports.TrackingGPS = TrackingGPS;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Tracking' }),
    __metadata("design:type", Number)
], TrackingGPS.prototype, "ID_Tracking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Latitud', type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], TrackingGPS.prototype, "Latitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Longitud', type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], TrackingGPS.prototype, "Longitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaHora', type: 'timestamp' }),
    __metadata("design:type", Date)
], TrackingGPS.prototype, "FechaHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Despacho' }),
    __metadata("design:type", Number)
], TrackingGPS.prototype, "ID_Despacho", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => despacho_entity_1.Despacho, despacho => despacho.trackings),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Despacho' }),
    __metadata("design:type", despacho_entity_1.Despacho)
], TrackingGPS.prototype, "despacho", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], TrackingGPS.prototype, "deleted_at", void 0);
exports.TrackingGPS = TrackingGPS = __decorate([
    (0, typeorm_1.Entity)('TrackingGPS')
], TrackingGPS);
//# sourceMappingURL=tracking-gps.entity.js.map