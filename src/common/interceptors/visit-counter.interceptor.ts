import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContadorVisitas } from '../entities/contador-visitas.entity';
import { Usuario } from '../../modules/auth/entities/usuario.entity';

@Injectable()
export class VisitCounterInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(ContadorVisitas)
    private readonly visitRepo: Repository<ContadorVisitas>,
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        if (!req) return;
        const route = req.route ? req.route.path : req.url;
        const user = req.user;
        
        // Dispara la escritura asíncrona sin bloquear la respuesta de la petición HTTP
        this.logVisit(route, user).catch(e => console.error('[Error Grabando Visita]', e));
      }),
    );
  }

  private async logVisit(route: string, reqUser: any) {
    let internalUserId = null;

    if (reqUser && reqUser.userId) {
      internalUserId = reqUser.userId;
    } else {
      // Búsqueda en memoria / BD de usuario Anónimo
      const anonUser = await this.userRepo.findOne({ where: { UserName: 'anonimo' } });
      if (anonUser) internalUserId = anonUser.ID_Usuario;
    }

    if (!internalUserId) return; // Si por alguna razón ni el anónimo existe, aborta.

    // Incremento o creación del registro
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
}
