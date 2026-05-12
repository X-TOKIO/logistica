import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ConfiguracionCorreo')
export class ConfiguracionCorreo {
  @PrimaryGeneratedColumn()
  ID_Config: number;

  @Column({ length: 255 })
  Host: string;

  @Column()
  Port: number;

  @Column({ length: 255 })
  Usuario: string;

  @Column({ length: 500 })
  Password: string;
}
