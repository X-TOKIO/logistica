import { NotaEgreso } from './nota-egreso.entity';
import { ProductoAlmacen } from '../../warehouse/entities/producto-almacen.entity';
import { Producto } from '../../warehouse/entities/producto.entity';
import { Sucursal } from '../../warehouse/entities/sucursal.entity';
export declare class DetalleEgreso {
    ID_Egreso: number;
    ID_Producto: number;
    ID_Almacen: number;
    Cantidad: number;
    ID_Sucursal: number;
    notaEgreso: NotaEgreso;
    productoAlmacen: ProductoAlmacen;
    producto: Producto;
    sucursal: Sucursal;
    deleted_at: Date;
}
