import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { NotaEgreso } from '../../inventory/entities/nota-egreso.entity';
import { Ruta } from './ruta.entity';
import { TrackingGPS } from './tracking-gps.entity';

@Entity('Despacho')
export class Despacho {
  @PrimaryGeneratedColumn({ name: 'ID_Despacho' })
  ID_Despacho: number;

  @Column({ name: 'FechaSalida', type: 'date' })
  FechaSalida: Date;

  @Column({ name: 'FechaEntregaEstimada', type: 'date' })
  FechaEntregaEstimada: Date;

  @Column({ name: 'FechaHora_Salida', type: 'timestamptz', nullable: true })
  FechaHora_Salida: Date;

  @Column({ name: 'FechaHora_Estimada_Entrega', type: 'timestamptz', nullable: true })
  FechaHora_Estimada_Entrega: Date;

  @Column({ name: 'ID_Egreso' })
  ID_Egreso: number;

  @Column({ name: 'ID_Ruta' })
  ID_Ruta: number;

  @Column({ name: 'Estado_Despacho', length: 20, default: 'PENDIENTE' })
  Estado_Despacho: string;

  @Column({ name: 'Progreso_Porcentaje', type: 'float', default: 0 })
  Progreso_Porcentaje: number;

  @Column({ name: 'Ultima_Actualizacion_Ms', type: 'float', nullable: true })
  Ultima_Actualizacion_Ms: number | null;

  @ManyToOne(() => NotaEgreso)
  @JoinColumn({ name: 'ID_Egreso' })
  notaEgreso: NotaEgreso;

  @ManyToOne(() => Ruta)
  @JoinColumn({ name: 'ID_Ruta' })
  ruta: Ruta;

  @OneToMany(() => TrackingGPS, tracking => tracking.despacho)
  trackings: TrackingGPS[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
