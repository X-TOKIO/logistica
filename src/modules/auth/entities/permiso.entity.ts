import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Permiso')
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'ID_Permiso' })
  ID_Permiso: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Descripcion', length: 300, nullable: true })
  Descripcion: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
