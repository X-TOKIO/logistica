import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { WarehouseService } from './warehouse.service';
export declare class WarehouseController {
    private readonly whService;
    constructor(whService: WarehouseService);
    getCategorias(): Promise<import("./entities/categoria.entity").Categoria[]>;
    createCategoria(dto: any): Promise<import("./entities/categoria.entity").Categoria>;
    updateCategoria(id: number, dto: any): Promise<import("./entities/categoria.entity").Categoria | null>;
    deleteCategoria(id: number): Promise<{
        success: boolean;
    }>;
    getMedidas(): Promise<import("./entities/u-medida.entity").UMedida[]>;
    createMedida(dto: any): Promise<import("./entities/u-medida.entity").UMedida>;
    updateMedida(id: number, dto: any): Promise<import("./entities/u-medida.entity").UMedida | null>;
    deleteMedida(id: number): Promise<{
        success: boolean;
    }>;
    getAlmacenes(): Promise<import("./entities/almacen.entity").Almacen[]>;
    createAlmacen(dto: any): Promise<import("./entities/almacen.entity").Almacen>;
    updateAlmacen(id: number, dto: any): Promise<import("./entities/almacen.entity").Almacen | null>;
    deleteAlmacen(id: number): Promise<{
        success: boolean;
    }>;
    getSucursales(): Promise<import("./entities/sucursal.entity").Sucursal[]>;
    createSucursal(dto: any): Promise<import("./entities/sucursal.entity").Sucursal>;
    updateSucursal(id: number, dto: any): Promise<import("./entities/sucursal.entity").Sucursal | null>;
    deleteSucursal(id: number): Promise<{
        success: boolean;
    }>;
    uploadImage(file: Express.Multer.File): {
        url: string;
    };
    exportPdf(search?: string, categoria?: string, almacen?: string, req?: any, res?: Response): Promise<StreamableFile>;
    getProductos(search?: string, categoria?: string, almacen?: string): Promise<import("./entities/producto.entity").Producto[]>;
    getProductoById(id: number): Promise<{
        stocks: import("./entities/producto-almacen.entity").ProductoAlmacen[];
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
        medida: import("./entities/u-medida.entity").UMedida;
        categoria: import("./entities/categoria.entity").Categoria;
        productoAlmacenes: import("./entities/producto-almacen.entity").ProductoAlmacen[];
        deleted_at: Date;
    }>;
    createProducto(dto: any): Promise<{
        stocks: import("./entities/producto-almacen.entity").ProductoAlmacen[];
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
        medida: import("./entities/u-medida.entity").UMedida;
        categoria: import("./entities/categoria.entity").Categoria;
        productoAlmacenes: import("./entities/producto-almacen.entity").ProductoAlmacen[];
        deleted_at: Date;
    }>;
    updateProducto(id: number, dto: any): Promise<{
        stocks: import("./entities/producto-almacen.entity").ProductoAlmacen[];
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
        medida: import("./entities/u-medida.entity").UMedida;
        categoria: import("./entities/categoria.entity").Categoria;
        productoAlmacenes: import("./entities/producto-almacen.entity").ProductoAlmacen[];
        deleted_at: Date;
    }>;
    deleteProducto(id: number): Promise<{
        success: boolean;
    }>;
}
