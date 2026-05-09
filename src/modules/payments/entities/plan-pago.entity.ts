import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { PagoLegado } from './pago-legado.entity';

@Entity('PlanPago')
export class PlanPago {
  @PrimaryColumn({ name: 'ID_Pago' })
  ID_Pago: number;

  @PrimaryColumn({ name: 'ID_Cuota' })
  ID_Cuota: number;

  @Column({ name: 'Fecha', type: 'date' })
  Fecha: Date;

  @Column({ name: 'Monto', type: 'decimal', precision: 12, scale: 2 })
  Monto: number;

  @Column({ name: 'Estado', length: 50 })
  Estado: string;

  @ManyToOne(() => PagoLegado)
  @JoinColumn({ name: 'ID_Pago' })
  pago: PagoLegado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
