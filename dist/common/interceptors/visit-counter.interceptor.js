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
exports.VisitCounterInterceptor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const operators_1 = require("rxjs/operators");
const contador_visitas_entity_1 = require("../entities/contador-visitas.entity");
const usuario_entity_1 = require("../../modules/auth/entities/usuario.entity");
let VisitCounterInterceptor = class VisitCounterInterceptor {
    visitRepo;
    userRepo;
    constructor(visitRepo, userRepo) {
        this.visitRepo = visitRepo;
        this.userRepo = userRepo;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(() => {
            const req = context.switchToHttp().getRequest();
            if (!req)
                return;
            const route = req.route ? req.route.path : req.url;
            const user = req.user;
            this.logVisit(route, user).catch(e => console.error('[Error Grabando Visita]', e));
        }));
    }
    async logVisit(route, reqUser) {
        let internalUserId = null;
        if (reqUser && reqUser.userId) {
            internalUserId = reqUser.userId;
        }
        else {
            const anonUser = await this.userRepo.findOne({ where: { UserName: 'anonimo' } });
            if (anonUser)
                internalUserId = anonUser.ID_Usuario;
        }
        if (!internalUserId)
            return;
        let visit = await this.visitRepo.findOne({ where: { NombrePagina: route, ID_Usuario: internalUserId } });
        if (!visit) {
            visit = this.visitRepo.create({
                NombrePagina: route,
                ID_Usuario: internalUserId,
                Contador: 0,
                UltimaVisita: new Date()
            });
        }
        visit.Contador += 1;
        visit.UltimaVisita = new Date();
        await this.visitRepo.save(visit);
    }
};
exports.VisitCounterInterceptor = VisitCounterInterceptor;
exports.VisitCounterInterceptor = VisitCounterInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contador_visitas_entity_1.ContadorVisitas)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VisitCounterInterceptor);
//# sourceMappingURL=visit-counter.interceptor.js.map