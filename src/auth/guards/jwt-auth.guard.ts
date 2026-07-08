import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err) throw new UnauthorizedException('Error al validar las credenciales de autenticación.');

    if (!user)
      throw new UnauthorizedException('El usuario no está autenticado o el token no es válido.');

    return user;
  }
}
