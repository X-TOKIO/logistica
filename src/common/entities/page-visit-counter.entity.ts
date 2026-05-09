import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PageVisitCounter')
export class PageVisitCounter {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ruta_pagina', unique: true, length: 300 })
  ruta_pagina: string;

  @Column({ name: 'total_visitas', type: 'int', default: 0 })
  total_visitas: number;
}
