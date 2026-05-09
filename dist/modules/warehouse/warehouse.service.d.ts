import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { UMedida } from './entities/u-medida.entity';
import { Almacen } from './entities/almacen.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Producto } from './entities/producto.entity';
import { ProductoAlmacen } from './entities/producto-almacen.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/create-categoria.dto';
import { CreateMedidaDto, UpdateMedidaDto } from './dto/create-medida.dto';
import { CreateAlmacenDto, UpdateAlmacenDto } from './dto/create-almacen.dto';
import { CreateSucursalDto, UpdateSucursalDto } from './dto/create-sucursal.dto';
import { CreateProductoDto, UpdateProductoDto } from './dto/create-producto.dto';
export declare class WarehouseService implements OnModuleInit {
    private catRepo;
    private medRepo;
    private almRepo;
    private sucRepo;
    private prodRepo;
    private prodAlmRepo;
    constructor(catRepo: Repository<Categoria>, medRepo: Repository<UMedida>, almRepo: Repository<Almacen>, sucRepo: Repository<Sucursal>, prodRepo: Repository<Producto>, prodAlmRepo: Repository<ProductoAlmacen>);
    onModuleInit(): Promise<void>;
    getCategorias(): Promise<Categoria[]>;
    createCategoria(dto: CreateCategoriaDto): Promise<Categoria>;
    updateCategoria(id: number, dto: UpdateCategoriaDto): Promise<Categoria | null>;
    deleteCategoria(id: number): Promise<{
        success: boolean;
    }>;
    getMedidas(): Promise<UMedida[]>;
    createMedida(dto: CreateMedidaDto): Promise<UMedida>;
    updateMedida(id: number, dto: UpdateMedidaDto): Promise<UMedida | null>;
    deleteMedida(id: number): Promise<{
        success: boolean;
    }>;
    getAlmacenes(): Promise<Almacen[]>;
    createAlmacen(dto: CreateAlmacenDto): Promise<Almacen>;
    updateAlmacen(id: number, dto: UpdateAlmacenDto): Promise<Almacen | null>;
    deleteAlmacen(id: number): Promise<{
        success: boolean;
    }>;
    getSucursales(): Promise<Sucursal[]>;
    createSucursal(dto: CreateSucursalDto): Promise<Sucursal>;
    updateSucursal(id: number, dto: UpdateSucursalDto): Promise<Sucursal | null>;
    deleteSucursal(id: number): Promise<{
        success: boolean;
    }>;
    getProductos(search?: string, categoriaId?: number, almacenId?: number): Promise<Producto[]>;
    getProductoById(id: number): Promise<{
        stocks: ProductoAlmacen[];
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
    }>;
    createProducto(dto: CreateProductoDto): Promise<{
        stocks: ProductoAlmacen[];
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
    }>;
    updateProducto(id: number, dto: UpdateProductoDto): Promise<{
        stocks: ProductoAlmacen[];
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
    }>;
    deleteProducto(id: number): Promise<{
        success: boolean;
    }>;
    private parseFactor;
    exportProductosPdf(search?: string, categoriaId?: number, almacenId?: number, username?: string): Promise<Buffer>;
}
