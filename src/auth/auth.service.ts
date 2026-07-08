import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginAuthDto } from '~/auth/dto/request/login-auth.dto';
import { ResponseHelper } from '~/common/response/response.helper';
import { DatabaseService } from '~/database/database.service';
import { TokenService } from '~/auth/services/token.service';
import { ProfileMappers } from '~/users/mappers/profile-mappers';
import { ProfileResponseDto } from '~/users/dto/response/profile-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.databaseService.user.findUnique({
      where: { email: email },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await argon2.verify(user.password, password!);

    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refresh(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new UnauthorizedException('Sesión no válida');

    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async getProfile(id: string): Promise<ResponseHelper<ProfileResponseDto>> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const profile = ProfileMappers.toResponse(user);

    return new ResponseHelper('Perfil obtenido correctamente', profile);
  }
}
