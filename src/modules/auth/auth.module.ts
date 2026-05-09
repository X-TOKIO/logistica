import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessController, RolesController, PermisosController } from './access.controller';
import { EmpleadosController } from './empleados.controller';
import { UsuariosController } from './usuarios.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

import { Usuario } from './entities/usuario.entity';
import { Empleado } from './entities/empleado.entity';
import { RolPermisoUsuario } from './entities/rol-permiso-usuario.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Empleado, RolPermisoUsuario, RolPermiso, Rol, Permiso]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION', '8h') as any },
      })
    })
  ],
  controllers: [AuthController, AccessController, RolesController, PermisosController, EmpleadosController, UsuariosController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
