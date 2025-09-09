import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true; // Si la ruta no requiere roles específicos, se permite el acceso
        }

        const { user } = context.switchToHttp().getRequest();
        // El payload del JWT del usuario debería contener el rol.
        // Verificamos si el rol del usuario está en la lista de roles requeridos.
        return requiredRoles.some((role) => user.role?.includes(role));
    }
}
