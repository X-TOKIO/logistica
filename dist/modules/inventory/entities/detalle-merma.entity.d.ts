import { Mermas } from './mermas.entity';
import { ProductoAlmacen } from '../../warehouse/entities/producto-almacen.entity';
import { Producto } from '../../warehouse/entities/producto.entity';
export declare class DetalleMerma {
    ID_Merma: number;
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
    merma: Mermas;
    productoAlmacen: ProductoAlmacen;
    producto: Producto;
    deleted_at: Date;
}
