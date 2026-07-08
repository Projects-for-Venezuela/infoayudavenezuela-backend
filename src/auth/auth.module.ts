import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from '~/auth/services/token.service';
import { JwtRefreshStrategy } from '~/auth/strategies/jwt-refresh.strategy';
import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/strategies/jwt.strategy';
import { AuthController } from '~/auth/auth.controller';
import { CookieService } from '~/auth/services/cookie.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, CookieService, JwtStrategy, JwtRefreshStrategy],
  exports: [TokenService, CookieService],
})
export class AuthModule {}
