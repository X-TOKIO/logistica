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
exports.CorreoEnviados = void 0;
const typeorm_1 = require("typeorm");
const empleado_entity_1 = require("../../modules/auth/entities/empleado.entity");
let CorreoEnviados = class CorreoEnviados {
    ID_Correo;
    Remitente;
    Destinatario;
    Asunto;
    Mensaje;
    FechaEnvio;
    Adjunto;
    ID_Empleado;
    empleado;
    deleted_at;
};
exports.CorreoEnviados = CorreoEnviados;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID_Correo' }),
    __metadata("design:type", Number)
], CorreoEnviados.prototype, "ID_Correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Remitente', length: 150 }),
    __metadata("design:type", String)
], CorreoEnviados.prototype, "Remitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Destinatario', length: 150 }),
    __metadata("design:type", String)
], CorreoEnviados.prototype, "Destinatario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Asunto', length: 200 }),
    __metadata("design:type", String)
], CorreoEnviados.prototype, "Asunto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Mensaje', type: 'text' }),
    __metadata("design:type", String)
], CorreoEnviados.prototype, "Mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FechaEnvio', type: 'timestamp' }),
    __metadata("design:type", Date)
], CorreoEnviados.prototype, "FechaEnvio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Adjunto', length: 300, nullable: true }),
    __metadata("design:type", String)
], CorreoEnviados.prototype, "Adjunto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ID_Empleado' }),
    __metadata("design:type", Number)
], CorreoEnviados.prototype, "ID_Empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado),
    (0, typeorm_1.JoinColumn)({ name: 'ID_Empleado' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], CorreoEnviados.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], CorreoEnviados.prototype, "deleted_at", void 0);
exports.CorreoEnviados = CorreoEnviados = __decorate([
    (0, typeorm_1.Entity)('CorreoEnviados')
], CorreoEnviados);
//# sourceMappingURL=correo-enviados.entity.js.map