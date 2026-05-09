import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('Empleado')
export class Empleado {
  @PrimaryGeneratedColumn({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Materno', length: 100, nullable: true })
  Materno: string;

  @Column({ name: 'Paterno', length: 100, nullable: true })
  Paterno: string;

  @Column({ name: 'CI', length: 20, unique: true })
  CI: string;

  @Column({ name: 'Telefono', length: 20, nullable: true })
  Telefono: string;

  @Column({ name: 'Direccion', length: 200, nullable: true })
  Direccion: string;

  @Column({ name: 'Cargo', length: 100, nullable: true })
  Cargo: string;

  @Column({ name: 'FechaContratacion', type: 'date' })
  FechaContratacion: Date;

  @Column({ name: 'Image', length: 300, nullable: true })
  Image: string;

  @OneToOne(() => Usuario, usuario => usuario.empleado)
  usuario: Usuario;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
