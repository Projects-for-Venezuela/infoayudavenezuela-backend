import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { RolesGuard } from '~/auth/guards/roles.guard';
import { JwtRefreshGuard } from '~/auth/guards/jwt-refresh.guard';

export const ROLES_KEY = 'roles';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiCookieAuth('cookieAuth'),

    ApiUnauthorizedResponse({
      description: 'No autorizado. Token inválido, expirado o usuario no autenticado.',
    }),

    ApiForbiddenResponse({
      description: 'El usuario no tiene permisos suficientes para acceder a este recurso.',
    }),
  );
}

export function AuthRefresh() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiCookieAuth('cookieAuth'),
    ApiUnauthorizedResponse({
      description: 'No autorizado. Token de actualización inválido o expirado.',
    }),
  );
}
