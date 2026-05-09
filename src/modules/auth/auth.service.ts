import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException, InternalServerErrorException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { RolPermisoUsuario } from './entities/rol-permiso-usuario.entity';
import { Empleado } from './entities/empleado.entity';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateUsuarioDto, UpdateSelfProfileDto } from './dto/update-usuario.dto';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Empleado) private readonly empleadoRepo: Repository<Empleado>,
    @InjectRepository(RolPermisoUsuario) private readonly rolPermisoUsuarioRepo: Repository<RolPermisoUsuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Permiso) private readonly perRepo: Repository<Permiso>,
    @InjectRepository(RolPermiso) private readonly rolPerRepo: Repository<RolPermiso>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async onApplicationBootstrap() {
    await this.seedInicial();
  }

  private async seedInicial() {
    this.logger.log('Iniciando verificación/inserción de Seed...');

    // 1. Roles Base — único rol de sistema; los demás los crea el administrador manualmente
    const exists = await this.rolRepo.findOne({ where: { Nombre: 'ADMINISTRADOR' } });
    if (!exists) await this.rolRepo.save({ Nombre: 'ADMINISTRADOR', Descripcion: 'Rol maestro del sistema' });

    // 1.1 Permisos por módulo (sistema simplificado On/Off)
    const modulosPermisos = [
      { nombre: 'MODULO_CATALOGO',    desc: 'Acceso al módulo de Catálogo (Categorías, Medidas, Productos)' },
      { nombre: 'MODULO_ALMACEN',     desc: 'Acceso al módulo de Almacenes y Sucursales' },
      { nombre: 'MODULO_INVENTARIO',  desc: 'Acceso al módulo de Inventario (Ingresos, Egresos, Mermas)' },
      { nombre: 'MODULO_DESPACHOS',   desc: 'Acceso al módulo de Despachos y Monitor Satelital' },
      { nombre: 'MODULO_TERMINAL',    desc: 'Acceso al módulo de Terminal Vehicular' },
      { nombre: 'MODULO_PROVEEDORES', desc: 'Acceso al módulo de Gestión de Proveedores' },
      { nombre: 'MODULO_FINANZAS',    desc: 'Acceso al módulo de Finanzas (Compras, Cuentas por Pagar)' },
      { nombre: 'MODULO_REPORTES',    desc: 'Acceso al módulo de Reportes e Inteligencia de Negocios' },
      { nombre: 'MODULO_RRHH',        desc: 'Acceso al módulo de Recursos Humanos' },
      { nombre: 'MODULO_USUARIOS',    desc: 'Acceso al módulo de Gestión de Usuarios' },
      { nombre: 'MODULO_SEGURIDAD',   desc: 'Acceso al módulo de Seguridad y Roles' },
    ];
    for (const { nombre, desc } of modulosPermisos) {
      const exists = await this.perRepo.findOne({ where: { Nombre: nombre } });
      if (!exists) await this.perRepo.save({ Nombre: nombre, Descripcion: desc });
    }

    // 1.12 Corregir typos conocidos en nombres de permisos (migración automática única)
    const typos = [
      { wrong: 'MODULO_DEESPACHOS', correct: 'MODULO_DESPACHOS' },
    ];
    for (const { wrong, correct } of typos) {
      const wrongPerm = await this.perRepo.findOne({ where: { Nombre: wrong } });
      if (!wrongPerm) continue;

      const correctPerm = await this.perRepo.findOne({ where: { Nombre: correct } });
      if (correctPerm) {
        // Ambas versiones existen: reasignar asignaciones de usuarios al ID correcto
        const wrongAssignments = await this.rolPermisoUsuarioRepo.find({ where: { ID_Permiso: wrongPerm.ID_Permiso } });
        for (const wa of wrongAssignments) {
          const alreadyCorrect = await this.rolPermisoUsuarioRepo.findOne({
            where: { ID_Usuario: wa.ID_Usuario, ID_Rol: wa.ID_Rol, ID_Permiso: correctPerm.ID_Permiso },
          });
          if (!alreadyCorrect) {
            await this.rolPermisoUsuarioRepo.save({
              ID_Usuario: wa.ID_Usuario,
              ID_Rol: wa.ID_Rol,
              ID_Permiso: correctPerm.ID_Permiso,
              fecha_asignacion: wa.fecha_asignacion,
            });
          }
        }
        // Borrar referencias al ID incorrecto (hijos primero para respetar FK)
        await this.rolPermisoUsuarioRepo.delete({ ID_Permiso: wrongPerm.ID_Permiso });
        await this.rolPerRepo.delete({ ID_Permiso: wrongPerm.ID_Permiso });
        await this.perRepo.delete(wrongPerm.ID_Permiso);
      } else {
        // Solo existe el typo — renombrar directamente (más eficiente, mantiene el ID)
        await this.perRepo.update(wrongPerm.ID_Permiso, { Nombre: correct });
      }
      this.logger.warn(`[FIX-TYPO] Permiso "${wrong}" corregido a "${correct}" en DB.`);
    }

    // 1.15 Limpiar permisos con formato antiguo (ACCESO_* o cualquier formato no MODULO_)
    const legacy = await this.perRepo
      .createQueryBuilder('p')
      .where("p.\"Nombre\" NOT LIKE 'MODULO_%'")
      .andWhere('p.deleted_at IS NULL')
      .getMany();
    for (const p of legacy) {
      await this.rolPermisoUsuarioRepo.delete({ ID_Permiso: p.ID_Permiso });
      await this.rolPerRepo.delete({ ID_Permiso: p.ID_Permiso });
      await this.perRepo.softDelete(p.ID_Permiso);
      this.logger.warn(`Permiso formato antiguo eliminado: "${p.Nombre}"`);
    }

    // 1.2 Asignar TODOS los permisos al rol ADMINISTRADOR en rol_permiso (sistema dinámico)
    const rolAdmin = await this.rolRepo.findOne({ where: { Nombre: 'ADMINISTRADOR' } });
    if (rolAdmin) {
      const todosPermisos = await this.perRepo.find();
      for (const permiso of todosPermisos) {
        const rpExists = await this.rolPerRepo.findOne({
          where: { ID_Rol: rolAdmin.ID_Rol, ID_Permiso: permiso.ID_Permiso },
        });
        if (!rpExists) {
          await this.rolPerRepo.save({ ID_Rol: rolAdmin.ID_Rol, ID_Permiso: permiso.ID_Permiso });
        }
      }
    }

    // 2. Empleado y Usuario Anónimo
    let empAnonimo = await this.empleadoRepo.findOne({ where: { CI: 'ANONIMO' } });
    if (!empAnonimo) {
      empAnonimo = await this.empleadoRepo.save({
        Nombre: 'Sistema', Paterno: 'Anónimo', CI: 'ANONIMO', FechaContratacion: new Date(),
      });
    }

    const usuAnonimo = await this.usuarioRepo.findOne({ where: { UserName: 'anonimo' } });
    if (!usuAnonimo) {
      await this.usuarioRepo.save({
        UserName: 'anonimo', Email: 'anon@paradiso.com', Password: 'x', Estado: 'SISTEMA', ID_Empleado: empAnonimo.ID_Empleado,
      });
    }

    // 3. Empleado y Usuario Administrador (Prueba)
    let empAdmin = await this.empleadoRepo.findOne({ where: { CI: 'ADMIN01' } });
    if (!empAdmin) {
      empAdmin = await this.empleadoRepo.save({
        Nombre: 'Gerencia', Paterno: 'General', CI: 'ADMIN01', FechaContratacion: new Date(),
      });
    }

    let usuAdmin = await this.usuarioRepo.findOne({ where: { UserName: 'admin' } });
    if (!usuAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Admin123*', salt);
      usuAdmin = await this.usuarioRepo.save({
        UserName: 'admin', Email: 'admin@paradiso.com', Password: hash, Estado: 'ACTIVO', ID_Empleado: empAdmin.ID_Empleado,
      });
      this.logger.log('=> Usuario Administrador base de datos creado exitosamente: admin / Admin123*');
    }

    // 3.1 Sincronizar rol_permiso_usuario para el admin — garantiza acceso dinámico sin bypasses
    if (rolAdmin && usuAdmin) {
      const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: rolAdmin.ID_Rol } });
      for (const rp of rolPermisos) {
        const rpuExists = await this.rolPermisoUsuarioRepo.findOne({
          where: { ID_Usuario: usuAdmin.ID_Usuario, ID_Rol: rolAdmin.ID_Rol, ID_Permiso: rp.ID_Permiso },
        });
        if (!rpuExists) {
          await this.rolPermisoUsuarioRepo.save({
            ID_Usuario: usuAdmin.ID_Usuario,
            ID_Rol: rolAdmin.ID_Rol,
            ID_Permiso: rp.ID_Permiso,
            fecha_asignacion: new Date(),
          });
        }
      }
    }

    this.logger.log('Verificación completada: Los datos fundamentales de RBAC y auditoría existen.');
  }

  // Empleados CRUD backend
  async createEmpleado(dto: any) {
    const exist = await this.empleadoRepo.findOne({ where: { CI: dto.CI } });
    if (exist) throw new ForbiddenException('CI Empleado ya existe');
    const nuevo = this.empleadoRepo.create({
      Nombre: dto.Nombre,
      Materno: dto.Materno,
      Paterno: dto.Paterno,
      CI: dto.CI,
      Telefono: dto.Telefono,
      Direccion: dto.Direccion,
      Cargo: dto.Cargo,
      FechaContratacion: new Date(dto.FechaContratacion),
    });
    return await this.empleadoRepo.save(nuevo);
  }

  async getEmpleados() {
    return await this.empleadoRepo.find({ order: { FechaContratacion: 'DESC' } });
  }

  async updateEmpleado(id: number, dto: any) {
    const emp = await this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
    if (!emp) throw new ForbiddenException('Empleado no encontrado');
    await this.empleadoRepo.update(id, {
      Nombre: dto.Nombre ?? emp.Nombre,
      Materno: dto.Materno ?? emp.Materno,
      Paterno: dto.Paterno ?? emp.Paterno,
      CI: dto.CI ?? emp.CI,
      Telefono: dto.Telefono ?? emp.Telefono,
      Direccion: dto.Direccion ?? emp.Direccion,
      Cargo: dto.Cargo ?? emp.Cargo,
      FechaContratacion: dto.FechaContratacion ? new Date(dto.FechaContratacion) : emp.FechaContratacion,
    });
    return this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
  }

  async deleteEmpleado(id: number) {
    const emp = await this.empleadoRepo.findOne({ where: { ID_Empleado: id } });
    if (!emp) throw new ForbiddenException('Empleado no encontrado');
    await this.empleadoRepo.softDelete(id);
    return { success: true };
  }

  async register(dto: RegisterAuthDto) {
    const empleado = await this.empleadoRepo.findOne({ where: { ID_Empleado: dto.ID_Empleado } });
    if (!empleado) throw new ForbiddenException('ID_Empleado inválido');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.Password, salt);

    const newUser = this.usuarioRepo.create({
      UserName: dto.UserName, Email: dto.Email, Password: hashedPassword, Estado: 'ACTIVO',
      ID_Empleado: dto.ID_Empleado, ID_Rol: dto.ID_Rol ?? null,
    });
    const savedUser = await this.usuarioRepo.save(newUser);

    if (dto.ID_Rol) {
      const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: dto.ID_Rol } });
      if (rolPermisos.length > 0) {
        const asignaciones = rolPermisos.map(rp => this.rolPermisoUsuarioRepo.create({
          ID_Usuario: savedUser.ID_Usuario,
          ID_Rol: rp.ID_Rol,
          ID_Permiso: rp.ID_Permiso,
          fecha_asignacion: new Date(),
        }));
        await this.rolPermisoUsuarioRepo.save(asignaciones);
      }
    }

    return savedUser;
  }

  private async getRolesYPermisos(userId: number): Promise<{ roles: string[]; permisos: string[] }> {
    const usuario = await this.usuarioRepo.findOne({
      where: { ID_Usuario: userId },
      relations: ['asignaciones'],
    });

    if (!usuario?.asignaciones?.length) return { roles: [], permisos: [] };

    const roleIds = [...new Set(usuario.asignaciones.map(a => a.ID_Rol))];
    const permIds = [...new Set(usuario.asignaciones.map(a => a.ID_Permiso))];

    const [rolesEntities, permisosEntities] = await Promise.all([
      roleIds.length > 0 ? this.rolRepo.find({ where: { ID_Rol: In(roleIds) } }) : [],
      permIds.length > 0 ? this.perRepo.find({ where: { ID_Permiso: In(permIds) } }) : [],
    ]);

    // Forzar array de strings planos — protección contra objetos TypeORM con relaciones
    const roles = rolesEntities.map(r => String(r.Nombre)).filter(Boolean);
    const permisos = permisosEntities.map(p => String(p.Nombre)).filter(Boolean);

    this.logger.log(`[RBAC] userId=${userId} → roles=[${roles.join(',')}] permisos=[${permisos.join(',')}]`);

    return { roles, permisos };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.usuarioRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.empleado', 'empleado')
      .where('user.UserName = :username', { username: dto.UserName })
      .addSelect('user.Password')
      .getOne();

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    if (user.Estado === 'BLOQUEADO_PERMANENTE') {
      throw new ForbiddenException('Cuenta bloqueada permanentemente. Contacte a un administrador.');
    }

    if (user.Estado === 'BLOQUEADO' && user.bloqueadoHasta) {
      if (new Date() < user.bloqueadoHasta) {
        let minutos = Math.ceil((user.bloqueadoHasta.getTime() - new Date().getTime()) / 60000);
        throw new ForbiddenException(`Cuenta temporalmente bloqueada por múltiples intentos. Restan ${minutos} min.`);
      } else {
        user.Estado = 'ACTIVO';
        user.bloqueadoHasta = null;
      }
    }

    const isMatch = await bcrypt.compare(dto.Password, user.Password);

    if (!isMatch) {
      user.intentosFallidos += 1;
      if (user.intentosFallidos >= 10) user.Estado = 'BLOQUEADO_PERMANENTE';
      else if (user.intentosFallidos % 3 === 0) {
        user.Estado = 'BLOQUEADO';
        user.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000);
      }
      await this.usuarioRepo.save(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    user.intentosFallidos = 0;
    user.bloqueadoHasta = null;
    user.Estado = 'ACTIVO';
    user.ultimoLogin = new Date();
    await this.usuarioRepo.save(user);

    const { roles: userRoles, permisos: userPermisos } = await this.getRolesYPermisos(user.ID_Usuario);

    const fullName = user.empleado
      ? [user.empleado.Nombre, user.empleado.Paterno].filter(Boolean).join(' ')
      : user.UserName;

    return {
      access_token: this.jwtService.sign({ sub: user.ID_Usuario, username: user.UserName, roles: userRoles, permissions: userPermisos }),
      user: { id: user.ID_Usuario, username: user.UserName, email: user.Email, fullName, roles: userRoles, permissions: userPermisos }
    };
  }

  async refreshToken(userId: number) {
    const user = await this.usuarioRepo.findOne({
      where: { ID_Usuario: userId },
      relations: ['empleado'],
    });
    if (!user) throw new UnauthorizedException('Usuario no válido');

    const { roles: userRoles, permisos: userPermisos } = await this.getRolesYPermisos(user.ID_Usuario);

    const fullName = user.empleado
      ? [user.empleado.Nombre, user.empleado.Paterno].filter(Boolean).join(' ')
      : user.UserName;

    return {
      access_token: this.jwtService.sign({ sub: user.ID_Usuario, username: user.UserName, roles: userRoles, permissions: userPermisos }),
      user: { id: user.ID_Usuario, username: user.UserName, email: user.Email, fullName, roles: userRoles, permissions: userPermisos }
    };
  }


  // --- Funciones para AccessController ---
  async getAllUsers() {
    return this.usuarioRepo.find({ relations: ['empleado'] });
  }

  async getMatrix() {
    const roles = await this.rolRepo.find();
    const permisos = await this.perRepo.find();
    return { roles, permisos };
  }

  async getUserMatrix(userId: number) {
    return this.rolPermisoUsuarioRepo.find({ where: { ID_Usuario: userId }, relations: ['rolPermiso', 'rolPermiso.rol', 'rolPermiso.permiso'] });
  }

  async assignRoleAccess(idUsuario: number, idRol: number, idPermiso: number) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
    if (!user) throw new ForbiddenException('Usuario inexistente.');

    let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
    if (!rp) rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });

    const exists = await this.rolPermisoUsuarioRepo.findOne({ where: { ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso } });
    if (exists) throw new UnauthorizedException('El empleado ya tiene asignado estre rol con este permiso.');

    const nuevaAsignacion = this.rolPermisoUsuarioRepo.create({
      ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso, fecha_asignacion: new Date()
    });
    return await this.rolPermisoUsuarioRepo.save(nuevaAsignacion);
  }

  async assignMultipleAccess(idUsuario: number, idRol: number, idPermisos: number[]) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
    if (!user) throw new ForbiddenException('Usuario inexistente.');

    for (const idPermiso of idPermisos) {
      let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
      if (!rp) {
        rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });
      }

      const exists = await this.rolPermisoUsuarioRepo.findOne({ where: { ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso } });
      if (!exists) {
        const nuevaAsignacion = this.rolPermisoUsuarioRepo.create({
          ID_Usuario: idUsuario,
          ID_Rol: idRol,
          ID_Permiso: idPermiso,
          fecha_asignacion: new Date()
        });
        await this.rolPermisoUsuarioRepo.save(nuevaAsignacion);
      }
    }

    return { success: true, message: 'Asignaciones creadas' };
  }

  async revokeAccess(idUsuario: number, idRol: number, idPermiso: number) {
    const rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
    if (rp) {
      await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: idUsuario, ID_Rol: idRol, ID_Permiso: idPermiso });
    }
    return { success: true, message: 'Revocado localmente' };
  }

  // ─── Roles CRUD ───
  async getAllRoles() {
    const roles = await this.rolRepo.find({ order: { Nombre: 'ASC' } });

    // Usamos Promise.all para procesar todos los roles en paralelo
    return await Promise.all(
      roles.map(async (rol) => {
        // Buscamos los vínculos activando la relación 'permiso' para obtener los Nombres
        const rps = await this.rolPerRepo.find({
          where: { ID_Rol: rol.ID_Rol },
          relations: ['permiso']
        });

        return {
          ...rol,
          // 'permisos' es lo que usa tu Frontend para los Tags (Burbujas de colores)
          permisos: rps.map(rp => rp.permiso),
          // 'permisoIds' lo usamos para los checkboxes al editar
          permisoIds: rps.map(rp => rp.ID_Permiso)
        };
      }),
    );
  }

  async getRolById(id: number) {
    return this.rolRepo.findOne({ where: { ID_Rol: id } });
  }

  async createRol(data: { nombre: string; descripcion?: string; permisos?: number[] }) {
    const existing = await this.rolRepo.findOne({ where: { Nombre: data.nombre } });
    if (existing) throw new ForbiddenException('Nombre de Rol ya existe');

    // Normalizamos el nombre a Mayúsculas y quitamos espacios por si acaso
    const rol = await this.rolRepo.save({
      Nombre: data.nombre.toUpperCase().trim(),
      Descripcion: data.descripcion || ''
    });

    if (data.permisos && data.permisos.length > 0) {
      // Creamos los vínculos de forma masiva
      const nuevosPermisos = data.permisos.map(idPermiso => ({
        ID_Rol: rol.ID_Rol,
        ID_Permiso: idPermiso
      }));
      await this.rolPerRepo.save(nuevosPermisos);
    }
    return rol;
  }

  async updateRol(id: number, data: { nombre: string; descripcion?: string; permisos?: number[] }) {
    const existing = await this.rolRepo.findOne({ where: { ID_Rol: id } });
    if (existing?.Nombre === 'ADMINISTRADOR') {
      throw new BadRequestException('Acción denegada: No se puede modificar el rol maestro del sistema.');
    }
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // 1. Actualizar nombre y descripción del rol
      await qr.manager.update(Rol, id, {
        Nombre: data.nombre.toUpperCase().trim(),
        Descripcion: data.descripcion ?? undefined,
      });

      if (data.permisos !== undefined) {
        // Guardar qué usuarios tenían este rol antes de limpiar.
        // Usamos dos fuentes: rol_permiso_usuario (usuarios con permisos activos) y
        // Usuario.ID_Rol (usuarios asignados aunque el rol tuviera 0 permisos al momento).
        const raw = await qr.manager
          .createQueryBuilder(RolPermisoUsuario, 'rpu')
          .select('DISTINCT rpu."ID_Usuario"', 'uid')
          .where('rpu."ID_Rol" = :id', { id })
          .getRawMany<{ uid: number }>();
        const fromDirectAssignment = await qr.manager.find(Usuario, { where: { ID_Rol: id } });
        const usuariosConRol = [
          ...new Set([...raw.map(r => r.uid), ...fromDirectAssignment.map(u => u.ID_Usuario)])
        ];

        // Borrar hijo → padre para respetar FK
        await qr.manager.createQueryBuilder().delete().from(RolPermisoUsuario).where('"ID_Rol" = :id', { id }).execute();
        await qr.manager.createQueryBuilder().delete().from(RolPermiso).where('"ID_Rol" = :id', { id }).execute();

        const ids = data.permisos.map(Number).filter(n => !isNaN(n) && n > 0);
        if (ids.length > 0) {
          await qr.manager.save(RolPermiso, ids.map(permId => ({ ID_Rol: id, ID_Permiso: permId })));

          // Re-asignar el rol con los nuevos permisos a los usuarios que lo tenían
          if (usuariosConRol.length > 0) {
            const reasignaciones = usuariosConRol.flatMap(uid =>
              ids.map(permId => ({
                ID_Usuario: uid,
                ID_Rol: id,
                ID_Permiso: permId,
                fecha_asignacion: new Date(),
              }))
            );
            await qr.manager.save(RolPermisoUsuario, reasignaciones);
          }
        }
      }

      await qr.commitTransaction();
      return this.getRolWithPermisos(id);
    } catch (error) {
      await qr.rollbackTransaction();
      this.logger.error('Error en updateRol (transaction rolled back):', error);
      throw new InternalServerErrorException('Fallo al sincronizar permisos del Rol en la DB');
    } finally {
      await qr.release();
    }
  }

  async getRolWithPermisos(id: number) {
    const rol = await this.rolRepo.findOne({ where: { ID_Rol: id } });
    const rps = await this.rolPerRepo.find({ where: { ID_Rol: id } });
    return { ...rol, permisoIds: rps.map(rp => rp.ID_Permiso) };
  }

  async deleteRol(id: number, requestingUserRoles: string[] = []) {
    const rol = await this.rolRepo.findOne({ where: { ID_Rol: id } });
    if (!rol) throw new BadRequestException('Rol no encontrado.');

    if (rol.Nombre === 'ADMINISTRADOR') {
      throw new BadRequestException('Acción denegada: No se puede eliminar ni modificar el rol maestro del sistema.');
    }
    if (requestingUserRoles.includes(rol.Nombre)) {
      throw new BadRequestException('Acción denegada: No puede eliminar un rol que tiene asignado actualmente.');
    }

    try {
      await this.rolPerRepo.delete({ ID_Rol: id });
      const result = await this.rolRepo.delete(id);
      if (result.affected === 0) throw new ForbiddenException('Rol no encontrado');
      return { success: true };
    } catch (error) {
      throw new ForbiddenException('No se puede eliminar: El rol está asignado a un empleado actualmente.');
    }
  }

  // ─── Usuarios ───
  async getAllUsuarios() {
    return this.usuarioRepo.find({
      relations: ['empleado'],
      order: { ID_Usuario: 'ASC' },
    });
  }

  async unlockUsuario(id: number) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id } });
    if (!user) throw new ForbiddenException('Usuario no encontrado.');

    user.Estado = 'ACTIVO';
    user.intentosFallidos = 0;
    user.bloqueadoHasta = null;
    await this.usuarioRepo.save(user);

    return { success: true, message: `Usuario ${user.UserName} desbloqueado correctamente.` };
  }

  async updateUsuarioEstado(id: number, estado: string) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id } });
    if (!user) throw new ForbiddenException('Usuario no encontrado.');

    const estadosValidos = ['ACTIVO', 'INACTIVO', 'BLOQUEADO_PERMANENTE'];
    if (!estadosValidos.includes(estado)) throw new ForbiddenException('Estado no válido.');

    user.Estado = estado;
    if (estado === 'ACTIVO') {
      user.intentosFallidos = 0;
      user.bloqueadoHasta = null;
    }
    await this.usuarioRepo.save(user);

    return { success: true, message: `Estado actualizado a ${estado}.` };
  }

  // ─── Permisos ───
  async getAllPermisos() {
    return this.perRepo.find({ order: { Nombre: 'ASC' } });
  }

  // ─── Edición de usuario (por admin) ───
  async updateUsuario(id: number, dto: UpdateUsuarioDto) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: id }, relations: ['empleado'] });
    if (!user) throw new ForbiddenException('Usuario no encontrado.');
    if (user.Estado === 'SISTEMA') throw new ForbiddenException('No se puede modificar el usuario del sistema.');

    const userUpdates: Partial<Usuario> = {};

    if (dto.Email && dto.Email !== user.Email) {
      const emailExists = await this.usuarioRepo.findOne({ where: { Email: dto.Email } });
      if (emailExists) throw new ForbiddenException('El email ya está en uso por otro usuario.');
      userUpdates.Email = dto.Email;
    }

    if (dto.NewPassword) {
      const salt = await bcrypt.genSalt(10);
      userUpdates.Password = await bcrypt.hash(dto.NewPassword, salt);
    }

    if (Object.keys(userUpdates).length > 0) {
      await this.usuarioRepo.update(id, userUpdates);
    }

    if (user.empleado && (dto.Nombre || dto.Paterno)) {
      const empUpdates: Partial<Empleado> = {};
      if (dto.Nombre) empUpdates.Nombre = dto.Nombre;
      if (dto.Paterno) empUpdates.Paterno = dto.Paterno;
      await this.empleadoRepo.update(user.empleado.ID_Empleado, empUpdates);
    }

    if (dto.ID_Rol) {
      // Track role assignment on Usuario so updateRol can find users even when rol_permiso_usuario is empty
      await this.usuarioRepo.update(id, { ID_Rol: dto.ID_Rol });

      // Sync Empleado.Cargo with the new role name so all modules show the current role
      const newRol = await this.rolRepo.findOne({ where: { ID_Rol: dto.ID_Rol } });
      if (newRol && user.empleado) {
        await this.empleadoRepo.update(user.empleado.ID_Empleado, { Cargo: newRol.Nombre });
      }

      await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: id });
      const rolPermisos = await this.rolPerRepo.find({ where: { ID_Rol: dto.ID_Rol } });
      if (rolPermisos.length > 0) {
        const nuevas = rolPermisos.map(rp => this.rolPermisoUsuarioRepo.create({
          ID_Usuario: id,
          ID_Rol: dto.ID_Rol,
          ID_Permiso: rp.ID_Permiso,
          fecha_asignacion: new Date(),
        }));
        await this.rolPermisoUsuarioRepo.save(nuevas);
      }
    }

    return { success: true, message: `Usuario ${user.UserName} actualizado correctamente.` };
  }

  // ─── Actualización de perfil propio ───
  async updateSelfProfile(userId: number, dto: UpdateSelfProfileDto) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: userId }, relations: ['empleado'] });
    if (!user) throw new ForbiddenException('Usuario no encontrado.');

    const userUpdates: Partial<Usuario> = {};

    if (dto.Email && dto.Email !== user.Email) {
      const emailExists = await this.usuarioRepo.findOne({ where: { Email: dto.Email } });
      if (emailExists) throw new ForbiddenException('El email ya está en uso.');
      userUpdates.Email = dto.Email;
    }

    if (dto.NewPassword) {
      const salt = await bcrypt.genSalt(10);
      userUpdates.Password = await bcrypt.hash(dto.NewPassword, salt);
    }

    if (Object.keys(userUpdates).length > 0) {
      await this.usuarioRepo.update(userId, userUpdates);
    }

    if (user.empleado && (dto.Nombre || dto.Paterno)) {
      const empUpdates: Partial<Empleado> = {};
      if (dto.Nombre) empUpdates.Nombre = dto.Nombre;
      if (dto.Paterno) empUpdates.Paterno = dto.Paterno;
      await this.empleadoRepo.update(user.empleado.ID_Empleado, empUpdates);
    }

    const updatedNombre = dto.Nombre ?? user.empleado?.Nombre ?? user.UserName;
    const updatedPaterno = dto.Paterno ?? user.empleado?.Paterno ?? '';
    const fullName = [updatedNombre, updatedPaterno].filter(Boolean).join(' ');

    return {
      success: true,
      message: 'Perfil actualizado correctamente.',
      updatedUser: {
        id: userId,
        username: user.UserName,
        email: dto.Email ?? user.Email,
        fullName,
      },
    };
  }

  // ─── Sync Atómico: borra todos los permisos del usuario e inserta el nuevo set ───
  async syncUserPermisos(idUsuario: number, idRol: number, idPermisos: number[]) {
    const user = await this.usuarioRepo.findOne({ where: { ID_Usuario: idUsuario } });
    if (!user) throw new ForbiddenException('Usuario inexistente.');

    // 1. Eliminar TODAS las asignaciones actuales del usuario para este rol
    await this.rolPermisoUsuarioRepo.delete({ ID_Usuario: idUsuario, ID_Rol: idRol });

    // 2. Re-insertar solo los permisos del nuevo set
    for (const idPermiso of idPermisos) {
      let rp = await this.rolPerRepo.findOne({ where: { ID_Rol: idRol, ID_Permiso: idPermiso } });
      if (!rp) rp = await this.rolPerRepo.save({ ID_Rol: idRol, ID_Permiso: idPermiso });

      await this.rolPermisoUsuarioRepo.save({
        ID_Usuario: idUsuario,
        ID_Rol: idRol,
        ID_Permiso: idPermiso,
        fecha_asignacion: new Date()
      });
    }

    return { success: true, message: 'Permisos sincronizados' };
  }
}
