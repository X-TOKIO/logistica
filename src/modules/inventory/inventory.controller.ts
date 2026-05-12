import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { CreateMermaDto } from './dto/create-merma.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_INVENTARIO')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly invService: InventoryService) {}

  @RequirePermissions('MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('reportes/stock')
  getStockReport() { return this.invService.getStockReport(); }

  @Get('ingresos')
  getIngresos() { return this.invService.getIngresos(); }

  @Post('ingresos')
  registrarIngreso(@Body() dto: CreateIngresoDto, @Req() req: any) {
    return this.invService.registrarIngreso(dto, req.user.userId);
  }

  @Get('egresos')
  getEgresos() { return this.invService.getEgresos(); }

  @Post('egresos')
  registrarEgreso(@Body() dto: CreateEgresoDto, @Req() req: any) {
    return this.invService.registrarEgreso(dto, req.user.userId);
  }

  @RequirePermissions('MODULO_INVENTARIO', 'MODULO_REPORTES')
  @Get('mermas')
  getMermas() { return this.invService.getMermas(); }

  @Post('mermas')
  registrarMerma(@Body() dto: CreateMermaDto, @Req() req: any) {
    return this.invService.registrarMerma(dto, req.user.userId);
  }
}
