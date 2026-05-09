import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';

@Entity('CorreoEnviado')
export class CorreoEnviado {
  @PrimaryGeneratedColumn({ name: 'ID_Correo' })
  ID_Correo: number;

  @Column({ name: 'Destinatario', length: 150 })
  Destinatario: string;

  @Column({ name: 'Asunto', length: 200 })
  Asunto: string;

  @Column({ name: 'TipoReporte', length: 50 })
  TipoReporte: string;

  @Column({ name: 'FechaEnvio', type: 'timestamp' })
  FechaEnvio: Date;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
