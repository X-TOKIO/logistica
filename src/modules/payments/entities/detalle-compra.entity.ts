import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { NotaCompra } from './nota-compra.entity';
import { Producto } from '../../warehouse/entities/producto.entity';

@Entity('DetalleCompra')
export class DetalleCompra {
  @PrimaryGeneratedColumn({ name: 'ID_Detalle' })
  ID_Detalle: number;

  @Column({ name: 'Cantidad', type: 'int' })
  Cantidad: number;

  @Column({ name: 'Precio_Unitario', type: 'decimal', precision: 10, scale: 2 })
  Precio_Unitario: number;

  @Column({ name: 'Subtotal', type: 'decimal', precision: 10, scale: 2 })
  Subtotal: number;

  @Column({ name: 'Fecha_Elaboracion', type: 'date', nullable: true })
  Fecha_Elaboracion: Date | null;

  @Column({ name: 'Fecha_Vencimiento', type: 'date', nullable: true })
  Fecha_Vencimiento: Date | null;

  @Column({ name: 'ID_Compra' })
  ID_Compra: number;

  @Column({ name: 'ID_Producto' })
  ID_Producto: number;

  @ManyToOne(() => NotaCompra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_Compra' })
  notaCompra: NotaCompra;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'ID_Producto' })
  producto: Producto;
}
