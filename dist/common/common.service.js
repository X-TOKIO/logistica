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
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_visit_counter_entity_1 = require("./entities/page-visit-counter.entity");
let CommonService = class CommonService {
    pageRepo;
    dedupMap = new Map();
    constructor(pageRepo) {
        this.pageRepo = pageRepo;
    }
    async incrementarVisita(ip, ruta) {
        const key = `${ip}:${ruta}`;
        const now = Date.now();
        const last = this.dedupMap.get(key);
        if (last !== undefined && now - last < 3000) {
            const record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
            return record?.total_visitas ?? 0;
        }
        this.dedupMap.set(key, now);
        if (this.dedupMap.size > 5000) {
            const cutoff = now - 60000;
            for (const [k, v] of this.dedupMap.entries()) {
                if (v < cutoff)
                    this.dedupMap.delete(k);
            }
        }
        let record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
        if (!record) {
            record = this.pageRepo.create({ ruta_pagina: ruta, total_visitas: 0 });
        }
        record.total_visitas += 1;
        await this.pageRepo.save(record);
        return record.total_visitas;
    }
    async getVisitasPorRuta(ruta) {
        const record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
        return record?.total_visitas ?? 0;
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_visit_counter_entity_1.PageVisitCounter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommonService);
//# sourceMappingURL=common.service.js.map