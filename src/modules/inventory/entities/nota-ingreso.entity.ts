import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';
import { NotaCompra } from '../../payments/entities/nota-compra.entity';
import { DetalleIngreso } from './detalle-ingreso.entity';

@Entity('NotaIngreso')
export class NotaIngreso {
  @PrimaryGeneratedColumn({ name: 'ID_Ingreso' })
  ID_Ingreso: number;

  @Column({ name: 'Fecha', type: 'date' })
  Fecha: Date;

  @Column({ name: 'Hora', type: 'time' })
  Hora: string;

  @Column({ name: 'Descripcion', length: 300, nullable: true })
  Descripcion: string;

  @Column({ name: 'Nombre', length: 100, nullable: true })
  Nombre: string;

  @Column({ name: 'ID_Compra', nullable: true })
  ID_Compra: number | null;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => NotaCompra, { nullable: true })
  @JoinColumn({ name: 'ID_Compra' })
  compra: NotaCompra;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @OneToMany(() => DetalleIngreso, (d) => d.notaIngreso)
  detalles: DetalleIngreso[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
