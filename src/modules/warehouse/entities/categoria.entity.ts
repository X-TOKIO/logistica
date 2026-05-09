import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Categoria')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'ID_Categoria' })
  ID_Categoria: number;

  @Column({ name: 'NombreC', length: 100 })
  NombreC: string;

  @Column({ name: 'Descripcion', length: 250, nullable: true })
  Descripcion: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
