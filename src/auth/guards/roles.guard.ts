import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'generated/prisma/enums';
import { ROLES_KEY } from '~/auth/decorators/auth.decorator';
import { AuthenticatedUser } from '~/auth/interfaces/authenticated-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    switch (user.role) {
      case Role.ADMIN:
      case Role.EDITOR:
        return true;

      default:
        throw new UnauthorizedException('No tienes permisos para acceder a este recurso.');
    }
  }
}
