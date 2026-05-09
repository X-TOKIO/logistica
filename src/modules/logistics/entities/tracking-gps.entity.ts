import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Despacho } from './despacho.entity';

@Entity('TrackingGPS')
export class TrackingGPS {
  @PrimaryGeneratedColumn({ name: 'ID_Tracking' })
  ID_Tracking: number;

  @Column({ name: 'Latitud', type: 'decimal', precision: 10, scale: 7 })
  Latitud: number;

  @Column({ name: 'Longitud', type: 'decimal', precision: 10, scale: 7 })
  Longitud: number;

  @Column({ name: 'FechaHora', type: 'timestamp' })
  FechaHora: Date;

  @Column({ name: 'ID_Despacho' })
  ID_Despacho: number;

  @ManyToOne(() => Despacho, despacho => despacho.trackings)
  @JoinColumn({ name: 'ID_Despacho' })
  despacho: Despacho;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
