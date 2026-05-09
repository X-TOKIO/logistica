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
exports.PageVisitCounter = void 0;
const typeorm_1 = require("typeorm");
let PageVisitCounter = class PageVisitCounter {
    id;
    ruta_pagina;
    total_visitas;
};
exports.PageVisitCounter = PageVisitCounter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], PageVisitCounter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ruta_pagina', unique: true, length: 300 }),
    __metadata("design:type", String)
], PageVisitCounter.prototype, "ruta_pagina", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_visitas', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PageVisitCounter.prototype, "total_visitas", void 0);
exports.PageVisitCounter = PageVisitCounter = __decorate([
    (0, typeorm_1.Entity)('PageVisitCounter')
], PageVisitCounter);
//# sourceMappingURL=page-visit-counter.entity.js.map