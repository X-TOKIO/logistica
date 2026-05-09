import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { Almacen } from './almacen.entity';

@Entity('ProductoAlmacen')
export class ProductoAlmacen {
  @PrimaryColumn({ name: 'ID_Producto' })
  ID_Producto: number;

  @PrimaryColumn({ name: 'ID_Almacen' })
  ID_Almacen: number;

  @Column({ name: 'Stock_Actual', type: 'decimal', precision: 10, scale: 2, default: 0 })
  Stock_Actual: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'ID_Producto' })
  producto: Producto;

  @ManyToOne(() => Almacen)
  @JoinColumn({ name: 'ID_Almacen' })
  almacen: Almacen;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
