import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE } from '~/auth/services/cookie.service';
import { JwtPayload } from '~/auth/interfaces/jwt-payload.interface';
import { AuthenticatedUser } from '~/auth/interfaces/authenticated-user.interface';
import { DatabaseService } from '~/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly databaseServices: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.[ACCESS_TOKEN_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload?.sub) throw new UnauthorizedException('Token inválido');

    const user = await this.databaseServices.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    return user;
  }
}
