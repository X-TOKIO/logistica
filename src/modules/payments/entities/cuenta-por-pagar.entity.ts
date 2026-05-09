import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, DeleteDateColumn, OneToMany
} from 'typeorm';
import { NotaCompra } from './nota-compra.entity';
import { CuotaCxP } from './cuota-cxp.entity';

@Entity('CuentaPorPagar')
export class CuentaPorPagar {
  @PrimaryGeneratedColumn({ name: 'ID_Cuenta' })
  ID_Cuenta: number;

  @Column({ name: 'Saldo_Pendiente', type: 'decimal', precision: 10, scale: 2 })
  Saldo_Pendiente: number;

  @Column({ name: 'Fecha_Vencimiento', type: 'date' })
  Fecha_Vencimiento: Date;

  @Column({ name: 'Estado_Pago', length: 20, default: 'PENDIENTE' })
  Estado_Pago: string;

  @Column({ name: 'ID_Compra' })
  ID_Compra: number;

  @ManyToOne(() => NotaCompra)
  @JoinColumn({ name: 'ID_Compra' })
  notaCompra: NotaCompra;

  @OneToMany(() => CuotaCxP, c => c.cuentaPorPagar)
  cuotas: CuotaCxP[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
