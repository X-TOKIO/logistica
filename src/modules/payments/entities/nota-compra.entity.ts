import {
  Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Empleado } from '../../auth/entities/empleado.entity';
import { Proveedor } from './proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';
import { Almacen } from '../../warehouse/entities/almacen.entity';

@Entity('NotaCompra')
export class NotaCompra {
  @PrimaryGeneratedColumn({ name: 'ID_Compra' })
  ID_Compra: number;

  @Column({ type: 'date', nullable: true })
  Fecha_Emision: Date;

  @Column({ name: 'Hora_Emision', type: 'time', nullable: true })
  Hora_Emision: string;

  @Column({ name: 'ID_Almacen', type: 'int', nullable: true })
  ID_Almacen: number;

  @ManyToOne(() => Almacen, { nullable: true })
  @JoinColumn({ name: 'ID_Almacen' })
  almacen: Almacen;

  @Column({ name: 'Costo_Envio', type: 'decimal', precision: 10, scale: 2, default: 0 })
  Costo_Envio: number;

  @Column({ name: 'Monto_Total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  Monto_Total: number;

  @Column({ name: 'Estado_Documento', length: 20, default: 'ACTIVO' })
  Estado_Documento: string;

  @Column({ name: 'Condicion_Pago', length: 20, default: 'CONTADO' })
  Condicion_Pago: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Nro_Factura: string;

  @Column({ name: 'Ref_Libelula', type: 'varchar', length: 80, nullable: true })
  Ref_Libelula: string | null;

  /** UUID propio de Libélula devuelto en el /registrar — prioridad 1 para /consultar */
  @Column({ name: 'Id_Libelula', type: 'varchar', length: 80, nullable: true })
  Id_Libelula: string | null;

  /** Código de recaudación numérico (12 dígitos) devuelto por Libélula — prioridad 2 para /consultar */
  @Column({ name: 'Codigo_Recaudacion', type: 'varchar', length: 30, nullable: true })
  Codigo_Recaudacion: string | null;

  /** JSON string[] con todos los PAY-... generados anteriormente (doble disparo) */
  @Column({ name: 'Refs_Previas', type: 'text', nullable: true })
  Refs_Previas: string | null;

  @Column({ name: 'Qr_Url', type: 'varchar', length: 500, nullable: true })
  Qr_Url: string | null;

  @Column({ name: 'ID_Proveedor' })
  ID_Proveedor: number;

  @Column({ name: 'ID_Empleado' })
  ID_Empleado: number;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'ID_Proveedor' })
  proveedor: Proveedor;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'ID_Empleado' })
  empleado: Empleado;

  @OneToMany(() => DetalleCompra, d => d.notaCompra)
  detalles: DetalleCompra[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
