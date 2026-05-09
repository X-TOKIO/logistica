import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UMedida } from './u-medida.entity';
import { Categoria } from './categoria.entity';
import { ProductoAlmacen } from './producto-almacen.entity';

@Entity('Producto')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'ID_Producto' })
  ID_Producto: number;

  @Column({ name: 'CodigoBarra', length: 100, unique: true, nullable: true })
  CodigoBarra: string;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Descripcion', length: 300, nullable: true })
  Descripcion: string;

  @Column({ name: 'FechaVencimiento', type: 'date', nullable: true })
  FechaVencimiento: Date;

  @Column({ name: 'Fecha_Elaboracion', type: 'date', nullable: true })
  Fecha_Elaboracion: Date;

  @Column({ name: 'Image', length: 300, nullable: true })
  Image: string;

  @Column({ name: 'Ubicacion', length: 100, nullable: true })
  Ubicacion: string;

  @Column({ name: 'PrecioUnitario', type: 'decimal', precision: 10, scale: 2 })
  PrecioUnitario: number;

  @Column({ name: 'ID_Medida' })
  ID_Medida: number;

  @Column({ name: 'ID_Categoria' })
  ID_Categoria: number;

  @ManyToOne(() => UMedida)
  @JoinColumn({ name: 'ID_Medida' })
  medida: UMedida;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'ID_Categoria' })
  categoria: Categoria;

  @OneToMany(() => ProductoAlmacen, pa => pa.producto)
  productoAlmacenes: ProductoAlmacen[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
