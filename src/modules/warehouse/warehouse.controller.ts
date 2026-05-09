import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  ParseIntPipe, UseGuards, UseInterceptors, UploadedFile,
  BadRequestException, Res, StreamableFile, Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import type { Response } from 'express';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly whService: WarehouseService) {}

  // ─── Categorías ───
  @RequirePermissions('MODULO_CATALOGO')
  @Get('categorias')    getCategorias() { return this.whService.getCategorias(); }
  @RequirePermissions('MODULO_CATALOGO')
  @Post('categorias')   createCategoria(@Body() dto: any) { return this.whService.createCategoria(dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Put('categorias/:id') updateCategoria(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.whService.updateCategoria(id, dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Delete('categorias/:id') deleteCategoria(@Param('id', ParseIntPipe) id: number) { return this.whService.deleteCategoria(id); }

  // ─── Medidas ───
  @RequirePermissions('MODULO_CATALOGO')
  @Get('medidas')    getMedidas() { return this.whService.getMedidas(); }
  @RequirePermissions('MODULO_CATALOGO')
  @Post('medidas')   createMedida(@Body() dto: any) { return this.whService.createMedida(dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Put('medidas/:id') updateMedida(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.whService.updateMedida(id, dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Delete('medidas/:id') deleteMedida(@Param('id', ParseIntPipe) id: number) { return this.whService.deleteMedida(id); }

  // ─── Almacenes ───
  @RequirePermissions('MODULO_ALMACEN', 'MODULO_CATALOGO', 'MODULO_INVENTARIO', 'MODULO_DESPACHOS', 'MODULO_FINANZAS', 'MODULO_TERMINAL', 'MODULO_REPORTES')
  @Get('almacenes')    getAlmacenes() { return this.whService.getAlmacenes(); }
  @RequirePermissions('MODULO_ALMACEN')
  @Post('almacenes')   createAlmacen(@Body() dto: any) { return this.whService.createAlmacen(dto); }
  @RequirePermissions('MODULO_ALMACEN')
  @Put('almacenes/:id') updateAlmacen(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.whService.updateAlmacen(id, dto); }
  @RequirePermissions('MODULO_ALMACEN')
  @Delete('almacenes/:id') deleteAlmacen(@Param('id', ParseIntPipe) id: number) { return this.whService.deleteAlmacen(id); }

  // ─── Sucursales ───
  @RequirePermissions('MODULO_ALMACEN', 'MODULO_DESPACHOS', 'MODULO_TERMINAL', 'MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('sucursales')    getSucursales() { return this.whService.getSucursales(); }
  @RequirePermissions('MODULO_ALMACEN')
  @Post('sucursales')   createSucursal(@Body() dto: any) { return this.whService.createSucursal(dto); }
  @RequirePermissions('MODULO_ALMACEN')
  @Put('sucursales/:id') updateSucursal(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.whService.updateSucursal(id, dto); }
  @RequirePermissions('MODULO_ALMACEN')
  @Delete('sucursales/:id') deleteSucursal(@Param('id', ParseIntPipe) id: number) { return this.whService.deleteSucursal(id); }

  // ─── Upload de imagen ───────────────────────────────────────────────────────
  @RequirePermissions('MODULO_CATALOGO')
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (_req: Express.Request, _file: Express.Multer.File, cb: (err: Error | null, dest: string) => void) => {
        const dir = './uploads/products';
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (_req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `prod-${suffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
      if (/\.(jpg|jpeg|png|webp)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten imágenes jpg, png o webp'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo.');
    return { url: `/uploads/products/${file.filename}` };
  }

  // ─── Productos ─────────────────────────────────────────────────────────────
  // export-pdf DEBE ir antes de :id para evitar colisión de rutas
  @RequirePermissions('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('productos/export-pdf')
  async exportPdf(
    @Query('search')    search?: string,
    @Query('categoria') categoria?: string,
    @Query('almacen')   almacen?: string,
    @Req() req?: any,
    @Res({ passthrough: true }) res?: Response,
  ) {
    (res as Response).set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=catalogo-productos.pdf',
    });
    const buffer = await this.whService.exportProductosPdf(
      search,
      categoria ? +categoria : undefined,
      almacen   ? +almacen   : undefined,
      req?.user?.username,
    );
    return new StreamableFile(buffer);
  }

  @RequirePermissions('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('productos')
  getProductos(
    @Query('search')    search?: string,
    @Query('categoria') categoria?: string,
    @Query('almacen')   almacen?: string,
  ) {
    return this.whService.getProductos(
      search,
      categoria ? +categoria : undefined,
      almacen   ? +almacen   : undefined,
    );
  }

  @RequirePermissions('MODULO_CATALOGO', 'MODULO_FINANZAS', 'MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('productos/:id')    getProductoById(@Param('id', ParseIntPipe) id: number) { return this.whService.getProductoById(id); }
  @RequirePermissions('MODULO_CATALOGO')
  @Post('productos')       createProducto(@Body() dto: any) { return this.whService.createProducto(dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Put('productos/:id')    updateProducto(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.whService.updateProducto(id, dto); }
  @RequirePermissions('MODULO_CATALOGO')
  @Delete('productos/:id') deleteProducto(@Param('id', ParseIntPipe) id: number) { return this.whService.deleteProducto(id); }
}
