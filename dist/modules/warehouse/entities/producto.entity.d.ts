import { UMedida } from './u-medida.entity';
import { Categoria } from './categoria.entity';
import { ProductoAlmacen } from './producto-almacen.entity';
export declare class Producto {
    ID_Producto: number;
    CodigoBarra: string;
    Nombre: string;
    Descripcion: string;
    FechaVencimiento: Date;
    Fecha_Elaboracion: Date;
    Image: string;
    Ubicacion: string;
    PrecioUnitario: number;
    ID_Medida: number;
    ID_Categoria: number;
    medida: UMedida;
    categoria: Categoria;
    productoAlmacenes: ProductoAlmacen[];
    deleted_at: Date;
}
