import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Despacho } from './despacho.entity';
import { Camion } from './camion.entity';

@Entity('despacho_camion')
export class DespachoCamion {
  @PrimaryColumn({ name: 'ID_Despacho' })
  ID_Despacho: number;

  @PrimaryColumn({ name: 'ID_Camion' })
  ID_Camion: number;

  @Column({ name: 'EstadoDeEnvio', length: 100 })
  EstadoDeEnvio: string;

  @ManyToOne(() => Despacho)
  @JoinColumn({ name: 'ID_Despacho' })
  despacho: Despacho;

  @ManyToOne(() => Camion)
  @JoinColumn({ name: 'ID_Camion' })
  camion: Camion;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
