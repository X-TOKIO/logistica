import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';
import { DetalleMerma } from './detalle-merma.entity';

@Entity('Mermas')
export class Mermas {
  @PrimaryGeneratedColumn({ name: 'ID_Merma' })
  ID_Merma: number;

  @Column({ name: 'Fecha', type: 'date' })
  Fecha: Date;

  @Column({ name: 'MotivoPerdida', length: 300 })
  MotivoPerdida: string;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @OneToMany(() => DetalleMerma, (d) => d.merma)
  detalles: DetalleMerma[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
