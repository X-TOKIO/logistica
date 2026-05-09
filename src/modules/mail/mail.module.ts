import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorreoEnviado } from './entities/correo-enviado.entity';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Usuario } from '../auth/entities/usuario.entity';
import { Producto } from '../warehouse/entities/producto.entity';
import { PlanPago } from '../payments/entities/plan-pago.entity';
import { Despacho } from '../logistics/entities/despacho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorreoEnviado, Usuario, Producto, PlanPago, Despacho])],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
