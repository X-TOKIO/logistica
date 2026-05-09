import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empleado } from './empleado.entity';
import { RolPermisoUsuario } from './rol-permiso-usuario.entity';

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'ID_Usuario' })
  ID_Usuario: number;

  @Column({ name: 'UserName', length: 100, unique: true })
  UserName: string;

  @Column({ name: 'Password', length: 300, select: false })
  Password: string;

  @Column({ name: 'Email', length: 150, unique: true })
  Email: string;

  @Column({ name: 'Estado', length: 50 })
  Estado: string;

  @Column({ name: 'intentosFallidos', type: 'int', default: 0 })
  intentosFallidos: number;

  @Column({ name: 'bloqueadoHasta', type: 'timestamp', nullable: true })
  bloqueadoHasta: Date | null;

  @Column({ name: 'ultimoLogin', type: 'timestamp', nullable: true })
  ultimoLogin: Date | null;

  @Column({ name: 'ID_Empleado', unique: true })
  ID_Empleado: number;

  @Column({ name: 'ID_Rol', type: 'int', nullable: true })
  ID_Rol: number | null;

  @OneToOne(() => Empleado, empleado => empleado.usuario)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @OneToMany(() => RolPermisoUsuario, rpu => rpu.usuario)
  asignaciones: RolPermisoUsuario[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
