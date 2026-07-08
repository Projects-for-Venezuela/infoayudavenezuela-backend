import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  override handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err)
      throw new UnauthorizedException(
        'El token de actualización es inválido, expiró o no pudo ser verificado.',
      );

    if (!user) throw new UnauthorizedException('La sesión no es válida. Inicie sesión nuevamente.');

    return user;
  }
}
