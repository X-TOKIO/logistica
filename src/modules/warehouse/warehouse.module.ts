import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { UMedida } from './entities/u-medida.entity';
import { Almacen } from './entities/almacen.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Producto } from './entities/producto.entity';
import { ProductoAlmacen } from './entities/producto-almacen.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, UMedida, Almacen, Sucursal, Producto, ProductoAlmacen])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
