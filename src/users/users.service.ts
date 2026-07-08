import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import { ResponseHelper } from '~/common/response/response.helper';
import { PaginationUserDto } from '~/users/dto/request/pagination-user.dto';
import * as argon2 from 'argon2';
import { Prisma, User, Role } from 'generated/prisma/client';
import { CreateUserDto } from '~/users/dto/request/create-user.dto';
import { UpdateUserDto } from '~/users/dto/request/update-user.dto';
import { PaginationHelper } from '~/common/pagination/pagination';
import { PaginatedResponse } from '~/common/pagination/interfaces/pagination.interface';
import { ProfileMappers } from '~/users/mappers/profile-mappers';
import { ProfileResponseDto } from '~/users/dto/response/profile-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseServices: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseHelper<void>> {
    const { email, password, role } = createUserDto;

    const emailExists = await this.databaseServices.user.findUnique({ where: { email } });

    if (emailExists) throw new ConflictException('El correo electrónico ya está registrado.');

    const hashedPassword = await argon2.hash(password!);

    await this.databaseServices.user.create({
      data: { ...createUserDto, password: hashedPassword, role: role ?? Role.EDITOR },
    });

    return new ResponseHelper('Usuario creado exitosamente');
  }

  async pagination(
    paginationUserDto: PaginationUserDto,
  ): Promise<PaginatedResponse<ProfileResponseDto>> {
    const { page, limit, search, role, skip, take } = paginationUserDto;

    const where: Prisma.UserWhereInput = {
      ...(search && { email: { contains: search, mode: 'insensitive' } }),
      ...(role && { role }),
    };

    const [users, total] = await this.databaseServices.$transaction([
      this.databaseServices.user.findMany({
        where,
        skip,
        take,
      }),
      this.databaseServices.user.count({ where }),
    ]);

    const mapper = ProfileMappers.toResponseList(users);

    return PaginationHelper.build(mapper, total, page, limit);
  }

  async findOne(id: string): Promise<ResponseHelper<ProfileResponseDto>> {
    const user = await this.databaseServices.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const mapper = ProfileMappers.toResponse(user);

    return new ResponseHelper('Usuario encontrado', mapper);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseHelper<void>> {
    const { email, password, role } = updateUserDto;

    const user = await this.databaseServices.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isEmailChanging = email !== undefined && email !== user.email;

    if (isEmailChanging) {
      const exists = await this.databaseServices.user.findUnique({ where: { email } });

      if (exists) throw new ConflictException('El correo electrónico ya está registrado.');
    }

    await this.databaseServices.user.update({
      where: { id },
      data: {
        email: isEmailChanging ? email : undefined,
        password: password ? await argon2.hash(password) : undefined,
        role,
      },
    });

    return new ResponseHelper('Usuario actualizado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const userExists = await this.databaseServices.user.findUnique({ where: { id } });

    if (!userExists) throw new NotFoundException('Usuario no encontrado');

    await this.databaseServices.user.delete({ where: { id } });

    return new ResponseHelper('Usuario eliminado exitosamente');
  }
}
