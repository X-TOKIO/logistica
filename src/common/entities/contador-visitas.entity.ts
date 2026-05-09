import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../modules/auth/entities/usuario.entity';

@Entity('ContadorVisitas')
export class ContadorVisitas {
  @PrimaryGeneratedColumn({ name: 'ID_Visita' })
  ID_Visita: number;

  @Column({ name: 'NombrePagina', length: 200 })
  NombrePagina: string;

  @Column({ name: 'Contador', type: 'int', default: 0 })
  Contador: number;

  @Column({ name: 'UltimaVisita', type: 'timestamp' })
  UltimaVisita: Date;

  @Column({ name: 'ID_Usuario' })
  ID_Usuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'ID_Usuario' })
  usuario: Usuario;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
