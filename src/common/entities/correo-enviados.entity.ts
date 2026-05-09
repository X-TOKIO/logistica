import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../modules/auth/entities/empleado.entity';

@Entity('CorreoEnviados')
export class CorreoEnviados {
  @PrimaryGeneratedColumn({ name: 'ID_Correo' })
  ID_Correo: number;

  @Column({ name: 'Remitente', length: 150 })
  Remitente: string;

  @Column({ name: 'Destinatario', length: 150 })
  Destinatario: string;

  @Column({ name: 'Asunto', length: 200 })
  Asunto: string;

  @Column({ name: 'Mensaje', type: 'text' })
  Mensaje: string;

  @Column({ name: 'FechaEnvio', type: 'timestamp' })
  FechaEnvio: Date;

  @Column({ name: 'Adjunto', length: 300, nullable: true })
  Adjunto: string;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
