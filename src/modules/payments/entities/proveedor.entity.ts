import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn({ name: 'ID_Proveedor' })
  ID_Proveedor: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Nombre_RazonSocial: string;

  @Column({ name: 'NIT', length: 50, unique: true })
  NIT: string;

  @Column({ name: 'Telefono', length: 30, nullable: true })
  Telefono: string;

  @Column({ name: 'Direccion', length: 300, nullable: true })
  Direccion: string;

  @Column({ name: 'Estado', length: 20, default: 'ACTIVO' })
  Estado: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
