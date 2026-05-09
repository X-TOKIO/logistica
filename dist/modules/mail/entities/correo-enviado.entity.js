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
exports.CorreoEnviado = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../auth/entities/empleado.entity");
let CorreoEnviado = class CorreoEnviado {
    ID_Correo;
    Destinatario;
    Asunto;
    TipoReporte;
    FechaEnvio;
    ID_Empleado;
    empleado;
    deleted_at;
};
exports.CorreoEnviado = CorreoEnviado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Correo' }),
    __metadata("design:type", Number)
], CorreoEnviado.prototype, "ID_Correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Destinatario', length: 150 }),
    __metadata("design:type", String)
], CorreoEnviado.prototype, "Destinatario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Asunto', length: 200 }),
    __metadata("design:type", String)
], CorreoEnviado.prototype, "Asunto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TipoReporte', length: 50 }),
    __metadata("design:type", String)
], CorreoEnviado.prototype, "TipoReporte", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaEnvio', type: 'timestamp' }),
    __metadata("design:type", Date)
], CorreoEnviado.prototype, "FechaEnvio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], CorreoEnviado.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], CorreoEnviado.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], CorreoEnviado.prototype, "deleted_at", void 0);
exports.CorreoEnviado = CorreoEnviado = __decorate([
    (0, typeorm_1.Entity)('CorreoEnviado')
], CorreoEnviado);
//# sourceMappingURL=correo-enviado.entity.js.map