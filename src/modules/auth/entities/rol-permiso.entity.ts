import { Entity, PrimaryColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';

@Entity('rol_permiso')
export class RolPermiso {
  @PrimaryColumn({ name: 'ID_Rol' })
  ID_Rol: number;

  @PrimaryColumn({ name: 'ID_Permiso' })
  ID_Permiso: number;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'ID_Rol' })
  rol: Rol;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'ID_Permiso' })
  permiso: Permiso;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
