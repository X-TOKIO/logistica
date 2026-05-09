import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';

@Entity('Vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn({ name: 'ID_Vehiculo' })
  ID_Vehiculo: number;

  @Column({ name: 'Placa', length: 20, unique: true })
  Placa: string;

  @Column({ name: 'Marca', length: 100 })
  Marca: string;

  @Column({ name: 'Modelo', length: 100 })
  Modelo: string;

  @Column({ name: 'Capacidad_Carga', type: 'decimal', precision: 10, scale: 2 })
  Capacidad_Carga: number;

  @Column({ name: 'Estado', length: 30, default: 'DISPONIBLE' })
  Estado: string;

  @Column({ name: 'ID_Empleado', nullable: true })
  ID_Empleado: number;

  @ManyToOne(() => Empleado, { nullable: true, eager: false })
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
