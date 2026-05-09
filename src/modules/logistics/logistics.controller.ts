import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly srv: LogisticsService) {}

  // ── Despachos / Monitor Satelital ─────────────────────────────────
  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Get('pendientes') getPendientes() { return this.srv.getPendientes(); }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Get('auxiliares') async getAuxiliares() {
    return { rutas: await this.srv.getRutas(), camiones: await this.srv.getCamiones() };
  }

  @RequirePermissions('MODULO_DESPACHOS')
  @Post('despacho') createDespacho(@Body() dto: any) { return this.srv.createDespacho(dto); }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Get('activos') getActivos(@Req() req: any) {
    return this.srv.getDespachosActivos(req.user.userId, req.user.roles);
  }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Post('tracking') addTracking(@Body() dto: any) { return this.srv.addTracking(dto); }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL', 'MODULO_REPORTES')
  @Get('historial') getHistorial(@Req() req: any) {
    return this.srv.getHistorial(req.user.userId, req.user.roles);
  }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Get('tracking-live') getLatestTracking() { return this.srv.getLatestTracking(); }

  @RequirePermissions('MODULO_DESPACHOS', 'MODULO_TERMINAL')
  @Patch('despacho/:id/progreso')
  updateDespachoProgreso(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { progreso: number; estado: string },
  ) { return this.srv.updateDespachoProgreso(id, body.progreso, body.estado); }

  // ── Terminal Vehicular ─────────────────────────────────────────────
  @RequirePermissions('MODULO_TERMINAL')
  @Patch('vehiculos/:id/estado')
  updateVehicleEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) { return this.srv.updateVehicleEstado(id, estado); }
}
