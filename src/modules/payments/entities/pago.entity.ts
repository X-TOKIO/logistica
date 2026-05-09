import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, DeleteDateColumn,
} from 'typeorm';
import { CuentaPorPagar } from './cuenta-por-pagar.entity';
import { Empleado } from '../../auth/entities/empleado.entity';

@Entity('RegistroPago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'ID_Pago' })
  ID_Pago: number;

  @Column({ name: 'Monto_Pagado', type: 'decimal', precision: 10, scale: 2 })
  Monto_Pagado: number;

  @Column({ name: 'Fecha_Pago', type: 'date' })
  Fecha_Pago: Date;

  @Column({ name: 'Metodo_Pago', type: 'varchar', length: 20 })
  Metodo_Pago: 'EFECTIVO' | 'QR';

  @Column({ type: 'varchar', length: 255, nullable: true })
  Referencia_Comprobante: string;

  @Column({ type: 'text', nullable: true })
  Observaciones: string;

  @Column({ name: 'ID_Cuenta' })
  ID_Cuenta: number;

  @ManyToOne(() => CuentaPorPagar)
  @JoinColumn({ name: 'ID_Cuenta' })
  cuentaPorPagar: CuentaPorPagar;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
