import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { NotaEgreso } from './nota-egreso.entity';
import { ProductoAlmacen } from '../../warehouse/entities/producto-almacen.entity';
import { Producto } from '../../warehouse/entities/producto.entity';
import { Sucursal } from '../../warehouse/entities/sucursal.entity';

@Entity('DetalleEgreso')
export class DetalleEgreso {
  @PrimaryColumn({ name: 'ID_Egreso' })
  ID_Egreso: number;

  @PrimaryColumn({ name: 'ID_Producto' })
  ID_Producto: number;

  @PrimaryColumn({ name: 'ID_Almacen' })
  ID_Almacen: number;

  @Column({ name: 'Cantidad', type: 'decimal', precision: 10, scale: 2 })
  Cantidad: number;

  @Column({ name: 'ID_Sucursal', type: 'int', nullable: true })
  ID_Sucursal: number;

  @ManyToOne(() => NotaEgreso, (n) => n.detalles)
  @JoinColumn({ name: 'ID_Egreso' })
  notaEgreso: NotaEgreso;

  @ManyToOne(() => ProductoAlmacen)
  @JoinColumn([
    { name: 'ID_Producto', referencedColumnName: 'ID_Producto' },
    { name: 'ID_Almacen', referencedColumnName: 'ID_Almacen' },
  ])
  productoAlmacen: ProductoAlmacen;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'ID_Producto' })
  producto: Producto;

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'ID_Sucursal' })
  sucursal: Sucursal;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
