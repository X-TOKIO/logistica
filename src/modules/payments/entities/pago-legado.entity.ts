import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { NotaCompra } from './nota-compra.entity';

@Entity('Pago')
export class PagoLegado {
  @PrimaryGeneratedColumn({ name: 'ID_Pago' })
  ID_Pago: number;

  @Column({ name: 'Fecha', type: 'date' })
  Fecha: Date;

  @Column({ name: 'Plazo', type: 'int' })
  Plazo: number;

  @Column({ name: 'MontoTotal', type: 'decimal', precision: 12, scale: 2 })
  MontoTotal: number;

  @Column({ name: 'ID_Compra', unique: true })
  ID_Compra: number;

  @OneToOne(() => NotaCompra)
  @JoinColumn({ name: 'ID_Compra' })
  notaCompra: NotaCompra;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
