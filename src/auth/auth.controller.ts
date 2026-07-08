import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthService } from '~/auth/auth.service';
import { CookieService } from '~/auth/services/cookie.service';
import { Auth } from '~/auth/decorators/auth.decorator';
import { AuthRefresh } from '~/auth/decorators/auth.decorator';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { LoginAuthDto } from '~/auth/dto/request/login-auth.dto';
import { ResponseHelper } from '~/common/response/response.helper';
import type { JwtPayload } from '~/auth/interfaces/jwt-payload.interface';
import type { AuthenticatedUser } from '~/auth/interfaces/authenticated-user.interface';

@ApiTags('auth')
@ApiInternalServerErrorResponse({
  description: 'Error interno del servidor.',
})
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Inicia sesión y establece las cookies de autenticación.' })
  @ApiOkResponse({ description: 'Inicio de sesión exitoso.' })
  @ApiTooManyRequestsResponse({
    description: 'Demasiados intentos de inicio de sesión. Intente de nuevo más tarde.',
  })
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginAuthDto);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return new ResponseHelper('Inicio de sesión exitoso');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @AuthRefresh()
  @ApiOperation({ summary: 'Renueva los tokens de acceso usando el token de actualización.' })
  @ApiOkResponse({ description: 'Token actualizado correctamente.' })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes de actualización. Intente de nuevo más tarde.',
  })
  async refresh(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(user.sub);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return new ResponseHelper('Token actualizado correctamente');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOperation({ summary: 'Cierra la sesión y elimina las cookies de autenticación.' })
  @ApiOkResponse({ description: 'Sesión cerrada correctamente.' })
  async logout(@Res({ passthrough: true }) response: ExpressResponse) {
    await this.cookieService.clearAuthCookies(response);

    return new ResponseHelper('Sesión cerrada correctamente');
  }

  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Obtiene el perfil del usuario autenticado.' })
  @ApiOkResponse({ description: 'Perfil obtenido correctamente.' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return await this.authService.getProfile(user.id);
  }
}
