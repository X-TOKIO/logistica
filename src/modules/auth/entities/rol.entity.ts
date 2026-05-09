import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany } from 'typeorm';
import { RolPermiso } from './rol-permiso.entity'; // Asegúrate de importar esto

@Entity('Rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'ID_Rol' })
  ID_Rol: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Descripcion', length: 300, nullable: true })
  Descripcion: string;

  // AGREGA ESTA LÍNEA:
  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.rol, { cascade: true })
  rolPermisos: RolPermiso[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}