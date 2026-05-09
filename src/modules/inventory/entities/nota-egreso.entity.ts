import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';
import { DetalleEgreso } from './detalle-egreso.entity';

@Entity('NotaEgreso')
export class NotaEgreso {
  @PrimaryGeneratedColumn({ name: 'ID_Egreso' })
  ID_Egreso: number;

  @Column({ name: 'Fecha', type: 'date' })
  Fecha: Date;

  @Column({ name: 'Hora', type: 'time' })
  Hora: string;

  @Column({ name: 'Descripcion', length: 300, nullable: true })
  Descripcion: string;

  @Column({ name: 'MontoTotal', type: 'decimal', precision: 12, scale: 2 })
  MontoTotal: number;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @OneToMany(() => DetalleEgreso, (d) => d.notaEgreso)
  detalles: DetalleEgreso[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
