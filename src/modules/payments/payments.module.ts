import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotaCompra } from './entities/nota-compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CuentaPorPagar } from './entities/cuenta-por-pagar.entity';
import { Proveedor } from './entities/proveedor.entity';
import { Pago } from './entities/pago.entity';
import { PagoLegado } from './entities/pago-legado.entity';
import { PlanPago } from './entities/plan-pago.entity';
import { CuotaCxP } from './entities/cuota-cxp.entity';
import { Producto } from '../warehouse/entities/producto.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsWebhookController } from './payments-webhook.controller';
import { LibelulaService } from './libelula.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotaCompra, DetalleCompra, CuentaPorPagar, CuotaCxP,
      Proveedor, Pago, PagoLegado, PlanPago, Producto, Usuario,
    ]),
  ],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService, LibelulaService],
})
export class PaymentsModule {}
