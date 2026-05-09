import { Producto } from './producto.entity';
import { Almacen } from './almacen.entity';
export declare class ProductoAlmacen {
    ID_Producto: number;
    ID_Almacen: number;
    Stock_Actual: number;
    producto: Producto;
    almacen: Almacen;
    deleted_at: Date;
}
