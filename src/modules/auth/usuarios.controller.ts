import { Controller, Get, Patch, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('MODULO_USUARIOS')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll() {
    return this.authService.getAllUsuarios();
  }

  @Patch(':id')
  updateUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.authService.updateUsuario(id, dto);
  }

  @Patch(':id/desbloquear')
  desbloquear(@Param('id', ParseIntPipe) id: number) {
    return this.authService.unlockUsuario(id);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.authService.updateUsuarioEstado(id, estado);
  }
}
