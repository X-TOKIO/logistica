import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LogisticsCatalogService } from './logistics-catalog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('logistics-catalog')
export class LogisticsCatalogController {
  constructor(private readonly svc: LogisticsCatalogService) {}

  // ── Proveedores ────────────────────────────────────────────────────────────

  @RequirePermissions('MODULO_PROVEEDORES', 'MODULO_FINANZAS', 'MODULO_REPORTES')
  @Get('proveedores')
  getProveedores() { return this.svc.getProveedores(); }

  @RequirePermissions('MODULO_PROVEEDORES')
  @Post('proveedores')
  createProveedor(@Body() dto: any) { return this.svc.createProveedor(dto); }

  @RequirePermissions('MODULO_PROVEEDORES')
  @Put('proveedores/:id')
  updateProveedor(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.svc.updateProveedor(id, dto);
  }

  @RequirePermissions('MODULO_PROVEEDORES')
  @Delete('proveedores/:id')
  removeProveedor(@Param('id', ParseIntPipe) id: number) { return this.svc.removeProveedor(id); }

  // ── Vehículos ──────────────────────────────────────────────────────────────

  @RequirePermissions('MODULO_TERMINAL', 'MODULO_DESPACHOS')
  @Get('vehiculos')
  getVehiculos() { return this.svc.getVehiculos(); }

  @RequirePermissions('MODULO_TERMINAL')
  @Post('vehiculos')
  createVehiculo(@Body() dto: any) { return this.svc.createVehiculo(dto); }

  @RequirePermissions('MODULO_TERMINAL')
  @Put('vehiculos/:id')
  updateVehiculo(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.svc.updateVehiculo(id, dto);
  }

  @RequirePermissions('MODULO_TERMINAL')
  @Delete('vehiculos/:id')
  removeVehiculo(@Param('id', ParseIntPipe) id: number) { return this.svc.removeVehiculo(id); }

  // ── Rutas ──────────────────────────────────────────────────────────────────

  @RequirePermissions('MODULO_DESPACHOS')
  @Get('rutas')
  getRutas() { return this.svc.getRutas(); }

  @RequirePermissions('MODULO_DESPACHOS')
  @Post('rutas')
  createRuta(@Body() dto: any) { return this.svc.createRuta(dto); }

  @RequirePermissions('MODULO_DESPACHOS')
  @Put('rutas/:id')
  updateRuta(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.svc.updateRuta(id, dto);
  }

  @RequirePermissions('MODULO_DESPACHOS')
  @Delete('rutas/:id')
  removeRuta(@Param('id', ParseIntPipe) id: number) { return this.svc.removeRuta(id); }
}
