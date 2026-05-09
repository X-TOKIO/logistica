import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('UMedida')
export class UMedida {
  @PrimaryGeneratedColumn({ name: 'ID_Medida' })
  ID_Medida: number;

  @Column({ name: 'Nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'Abreviatura', length: 20 })
  Abreviatura: string;

  @Column({ name: 'Unidades_Bulto', type: 'varchar', length: 20, default: '1' })
  Unidades_Bulto: string;

  @Column({ name: 'factor_conversion', type: 'int', default: 1 })
  factor_conversion: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
