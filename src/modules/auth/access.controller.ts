import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_USUARIOS', 'MODULO_SEGURIDAD')
@Controller('access')
export class AccessController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  getUsers() {
    return this.authService.getAllUsers();
  }

  @Get('matrix')
  getMatrix() {
    return this.authService.getMatrix();
  }

  @Get('user-matrix/:id')
  getUserMatrix(@Param('id') id: string) {
    return this.authService.getUserMatrix(Number(id));
  }

  @Post('assign')
  assignRole(@Body() body: { ID_Usuario: number, ID_Rol: number, ID_Permiso: number }) {
    if (!body.ID_Usuario || !body.ID_Rol || !body.ID_Permiso) {
        throw new Error('Faltan relaciones lógicas de la llave compuesta');
    }
    return this.authService.assignRoleAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permiso);
  }

  @Post('assign-multiple')
  assignMultiple(@Body() body: { ID_Usuario: number, ID_Rol: number, ID_Permisos: number[] }) {
    if (!body.ID_Usuario || !body.ID_Rol || !body.ID_Permisos?.length) {
        throw new Error('Faltan relaciones lógicas para asignación masiva');
    }
    return this.authService.assignMultipleAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permisos);
  }

  // POST /access/sync  — TRANSACCIÓN ATÓMICA: borra anteriores e inserta nuevos
  @Post('sync')
  syncPermisos(@Body() body: { ID_Usuario: number, ID_Rol: number, ID_Permisos: number[] }) {
    return this.authService.syncUserPermisos(body.ID_Usuario, body.ID_Rol, body.ID_Permisos);
  }

  @Post('revoke')
  revokeRole(@Body() body: { ID_Usuario: number, ID_Rol: number, ID_Permiso: number }) {
    return this.authService.revokeAccess(body.ID_Usuario, body.ID_Rol, body.ID_Permiso);
  }
}

// ─────────────────────────────────────────────────────────────
// Controller separado para /roles  (CRUD completo)
// ─────────────────────────────────────────────────────────────
import { Controller as NestController } from '@nestjs/common';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_SEGURIDAD', 'MODULO_RRHH')
@Controller('roles')
export class RolesController {
  constructor(private readonly authService: AuthService) {}

  @RequirePermissions('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS')
  @Get()
  getAll() {
    return this.authService.getAllRoles();
  }

  @RequirePermissions('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS')
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.authService.getRolById(Number(id));
  }

  @RequirePermissions('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS')
  @Get(':id/permisos')
  getWithPermisos(@Param('id') id: string) {
    return this.authService.getRolWithPermisos(Number(id));
  }

  @RequirePermissions('MODULO_SEGURIDAD')
  @Post()
  create(@Body() body: { nombre: string; descripcion?: string; permisos?: number[] }) {
    return this.authService.createRol(body);
  }

  @RequirePermissions('MODULO_SEGURIDAD')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: { nombre: string; descripcion?: string; permisos?: number[] }, @Req() req: any) {
    return this.authService.updateRol(Number(id), body);
  }

  @RequirePermissions('MODULO_SEGURIDAD')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userRoles: string[] = req.user?.roles ?? [];
    return this.authService.deleteRol(Number(id), userRoles);
  }
}

// ─────────────────────────────────────────────────────────────
// Controller separado para /permisos (solo lectura)
// ─────────────────────────────────────────────────────────────
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_SEGURIDAD', 'MODULO_RRHH', 'MODULO_USUARIOS')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll() {
    return this.authService.getAllPermisos();
  }
}
