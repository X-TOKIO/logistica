import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log('🛠️ Payload en Guard:', JSON.stringify(user));

    if (!user) return false;

    if (!user.permissions?.length) {
      this.logger.warn(`DENEGADO — usuario sin permisos. Requerido: [${required.join(', ')}]`);
      return false;
    }

    const userPermsUpper = user.permissions.map((up: string) => up.toUpperCase());
    const granted = required.some(p => userPermsUpper.includes(p.toUpperCase()));
    if (!granted) {
      this.logger.warn(
        `DENEGADO — Permisos usuario: [${user.permissions.join(', ')}] | Requerido: [${required.join(', ')}]`,
      );
    }
    return granted;
  }
}
