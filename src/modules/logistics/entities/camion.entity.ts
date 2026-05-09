import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';

@Entity('Camion')
export class Camion {
  @PrimaryGeneratedColumn({ name: 'ID_Camion' })
  ID_Camion: number;

  @Column({ name: 'Placa', length: 20, unique: true })
  Placa: string;

  @Column({ name: 'Modelo', length: 100 })
  Modelo: string;

  @Column({ name: 'CapacidadCarga', type: 'decimal', precision: 10, scale: 2 })
  CapacidadCarga: number;

  @Column({ name: 'Estado', length: 50 })
  Estado: string;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
