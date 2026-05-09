import { NotaIngreso } from './nota-ingreso.entity';
import { ProductoAlmacen } from '../../warehouse/entities/producto-almacen.entity';
import { Producto } from '../../warehouse/entities/producto.entity';
export declare class DetalleIngreso {
    ID_Ingreso: number;
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
    notaIngreso: NotaIngreso;
    productoAlmacen: ProductoAlmacen;
    producto: Producto;
    deleted_at: Date;
}
