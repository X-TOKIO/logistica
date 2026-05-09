import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';
import { Usuario } from './usuario.entity';

@Entity('rol_permiso_usuario')
export class RolPermisoUsuario {
  @PrimaryColumn({ name: 'ID_Rol' })
  ID_Rol: number;

  @PrimaryColumn({ name: 'ID_Permiso' })
  ID_Permiso: number;

  @PrimaryColumn({ name: 'ID_Usuario' })
  ID_Usuario: number;

  @Column({ name: 'fecha_asignacion', type: 'date' })
  fecha_asignacion: Date;

  @ManyToOne(() => RolPermiso)
  @JoinColumn([
    { name: 'ID_Rol', referencedColumnName: 'ID_Rol' },
    { name: 'ID_Permiso', referencedColumnName: 'ID_Permiso' }
  ])
  rolPermiso: RolPermiso;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'ID_Usuario' })
  usuario: Usuario;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
