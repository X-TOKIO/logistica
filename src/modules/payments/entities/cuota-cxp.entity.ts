import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { CuentaPorPagar } from './cuenta-por-pagar.entity';

@Entity('CuotaCxP')
export class CuotaCxP {
  @PrimaryGeneratedColumn({ name: 'ID_CuotaCxP' })
  ID_CuotaCxP: number;

  @Column({ name: 'ID_Cuenta' })
  ID_Cuenta: number;

  @Column({ name: 'Numero_Cuota', type: 'int' })
  Numero_Cuota: number;

  @Column({ name: 'Fecha_Vencimiento', type: 'date' })
  Fecha_Vencimiento: Date;

  @Column({ name: 'Monto', type: 'decimal', precision: 10, scale: 2 })
  Monto: number;

  @Column({ name: 'Estado', length: 20, default: 'PENDIENTE' })
  Estado: string;

  @ManyToOne(() => CuentaPorPagar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_Cuenta' })
  cuentaPorPagar: CuentaPorPagar;
}
