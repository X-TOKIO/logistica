import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotaIngreso } from './entities/nota-ingreso.entity';
import { DetalleIngreso } from './entities/detalle-ingreso.entity';
import { NotaEgreso } from './entities/nota-egreso.entity';
import { DetalleEgreso } from './entities/detalle-egreso.entity';
import { Mermas } from './entities/mermas.entity';
import { DetalleMerma } from './entities/detalle-merma.entity';
import { ProductoAlmacen } from '../warehouse/entities/producto-almacen.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';
import { NotaCompra } from '../payments/entities/nota-compra.entity';

import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotaIngreso, DetalleIngreso,
      NotaEgreso, DetalleEgreso,
      Mermas, DetalleMerma,
      ProductoAlmacen,
      Proveedor, NotaCompra,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
