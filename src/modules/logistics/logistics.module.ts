import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Ruta } from './entities/ruta.entity';
import { Camion } from './entities/camion.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Despacho } from './entities/despacho.entity';
import { DespachoCamion } from './entities/despacho-camion.entity';
import { TrackingGPS } from './entities/tracking-gps.entity';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { LogisticsCatalogService } from './logistics-catalog.service';
import { LogisticsCatalogController } from './logistics-catalog.controller';

import { NotaEgreso } from '../inventory/entities/nota-egreso.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { Almacen } from '../warehouse/entities/almacen.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Sucursal, Ruta, Camion, Vehiculo, Despacho, DespachoCamion, TrackingGPS,
    NotaEgreso, Usuario, Almacen, Proveedor,
  ])],
  controllers: [LogisticsController, LogisticsCatalogController],
  providers: [LogisticsService, LogisticsCatalogService],
  exports: [TypeOrmModule],
})
export class LogisticsModule {}
