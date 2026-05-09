import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { NotaIngreso } from './nota-ingreso.entity';
import { ProductoAlmacen } from '../../warehouse/entities/producto-almacen.entity';
import { Producto } from '../../warehouse/entities/producto.entity';

@Entity('DetalleIngreso')
export class DetalleIngreso {
  @PrimaryColumn({ name: 'ID_Ingreso' })
  ID_Ingreso: number;

  @PrimaryColumn({ name: 'ID_Producto' })
  ID_Producto: number;

  @PrimaryColumn({ name: 'ID_Almacen' })
  ID_Almacen: number;

  @Column({ name: 'Cantidad', type: 'decimal', precision: 10, scale: 2 })
  Cantidad: number;

  @ManyToOne(() => NotaIngreso, (n) => n.detalles)
  @JoinColumn({ name: 'ID_Ingreso' })
  notaIngreso: NotaIngreso;

  @ManyToOne(() => ProductoAlmacen)
  @JoinColumn([
    { name: 'ID_Producto', referencedColumnName: 'ID_Producto' },
    { name: 'ID_Almacen', referencedColumnName: 'ID_Almacen' },
  ])
  productoAlmacen: ProductoAlmacen;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'ID_Producto' })
  producto: Producto;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
