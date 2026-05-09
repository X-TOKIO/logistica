import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { ContadorVisitas } from '../entities/contador-visitas.entity';
import { Usuario } from '../../modules/auth/entities/usuario.entity';
export declare class VisitCounterInterceptor implements NestInterceptor {
    private readonly visitRepo;
    private readonly userRepo;
    constructor(visitRepo: Repository<ContadorVisitas>, userRepo: Repository<Usuario>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logVisit;
}
