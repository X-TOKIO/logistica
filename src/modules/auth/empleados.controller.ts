import { Controller, Post, Put, Delete, Body, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly authService: AuthService) {}

  // Lectura accesible a cualquier módulo que necesite listar empleados
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('MODULO_TERMINAL', 'MODULO_RRHH', 'MODULO_USUARIOS', 'MODULO_SEGURIDAD', 'MODULO_DESPACHOS')
  @Get()
  getEmpleados() {
    return this.authService.getEmpleados();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('MODULO_RRHH')
  @Post()
  createEmpleado(@Body() body: any) {
    return this.authService.createEmpleado(body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('MODULO_RRHH')
  @Put(':id')
  updateEmpleado(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.authService.updateEmpleado(id, body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('MODULO_RRHH')
  @Delete(':id')
  deleteEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteEmpleado(id);
  }
}
