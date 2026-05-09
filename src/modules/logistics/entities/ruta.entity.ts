import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Almacen } from '../../warehouse/entities/almacen.entity';
import { Sucursal } from './sucursal.entity';

@Entity('Ruta')
export class Ruta {
  @PrimaryGeneratedColumn({ name: 'ID_Ruta' })
  ID_Ruta: number;

  @Column({ name: 'Nombre_Ruta', length: 200, nullable: true })
  Nombre_Ruta: string;

  @Column({ name: 'Origen', length: 300, nullable: true })
  Origen: string;

  @Column({ name: 'Destino', length: 300, nullable: true })
  Destino: string;

  @Column({ name: 'Distancia_KM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  Distancia_KM: number;

  @Column({ name: 'Tiempo_Estimado_Horas', type: 'decimal', precision: 6, scale: 2, nullable: true })
  Tiempo_Estimado_Horas: number;

  @Column({ name: 'LatitudOrigen', type: 'decimal', precision: 10, scale: 7, nullable: true })
  LatitudOrigen: number;

  @Column({ name: 'LongitudOrigen', type: 'decimal', precision: 10, scale: 7, nullable: true })
  LongitudOrigen: number;

  @Column({ name: 'LatitudDestino', type: 'decimal', precision: 10, scale: 7, nullable: true })
  LatitudDestino: number;

  @Column({ name: 'LongitudDestino', type: 'decimal', precision: 10, scale: 7, nullable: true })
  LongitudDestino: number;

  @Column({ name: 'ID_Almacen', nullable: true })
  ID_Almacen: number;

  @Column({ name: 'ID_Sucursal', nullable: true })
  ID_Sucursal: number;

  @ManyToOne(() => Almacen, { nullable: true })
  @JoinColumn({ name: 'ID_Almacen' })
  almacen: Almacen;

  @ManyToOne(() => Sucursal, { nullable: true })
  @JoinColumn({ name: 'ID_Sucursal' })
  sucursal: Sucursal;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
