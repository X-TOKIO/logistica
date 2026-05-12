import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorreoEnviado } from './entities/correo-enviado.entity';
import { ConfiguracionCorreo } from './entities/configuracion-correo.entity';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Usuario } from '../auth/entities/usuario.entity';
import { Producto } from '../warehouse/entities/producto.entity';
import { PlanPago } from '../payments/entities/plan-pago.entity';
import { Despacho } from '../logistics/entities/despacho.entity';
import { NotaCompra } from '../payments/entities/nota-compra.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorreoEnviado, ConfiguracionCorreo, Usuario, Producto, PlanPago, Despacho, NotaCompra, Proveedor])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
