import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Almacen')
export class Almacen {
  @PrimaryGeneratedColumn({ name: 'ID_Almacen' })
  ID_Almacen: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Direccion', length: 200 })
  Direccion: string;

  @Column({ name: 'Latitud', type: 'decimal', precision: 10, scale: 7, nullable: true })
  Latitud: number;

  @Column({ name: 'Longitud', type: 'decimal', precision: 10, scale: 7, nullable: true })
  Longitud: number;

  @Column({ name: 'Color', length: 20, nullable: true, default: '#6366f1' })
  Color: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
