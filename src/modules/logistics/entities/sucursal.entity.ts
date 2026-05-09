import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn({ name: 'ID_Sucursal' })
  ID_Sucursal: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Direccion', length: 200 })
  Direccion: string;

  @Column({ name: 'Telefono', length: 20, nullable: true })
  Telefono: string;

  @Column({ name: 'StockCritico', type: 'int', default: 0 })
  StockCritico: number;

  @Column({ name: 'Latitud', type: 'decimal', precision: 10, scale: 7, nullable: true })
  Latitud: number;

  @Column({ name: 'Longitud', type: 'decimal', precision: 10, scale: 7, nullable: true })
  Longitud: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
