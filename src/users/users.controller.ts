import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { Auth } from '~/auth/decorators/auth.decorator';
import { CreateUserDto } from '~/users/dto/request/create-user.dto';
import { UpdateUserDto } from '~/users/dto/request/update-user.dto';
import { PaginationUserDto } from '~/users/dto/request/pagination-user.dto';
import { UsersService } from '~/users/users.service';

const ID_PARAM = 'id';

@ApiTags('users')
@ApiInternalServerErrorResponse({
  description: 'Error interno del servidor.',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Crea un nuevo usuario.' })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente.' })
  @ApiConflictResponse({ description: 'El correo electrónico ya está registrado.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Lista los usuarios de forma paginada.' })
  @ApiOkResponse({ description: 'Usuarios obtenidos correctamente.' })
  async pagination(@Query() paginationUserDto: PaginationUserDto) {
    return await this.usersService.pagination(paginationUserDto);
  }

  @Get(`:${ID_PARAM}`)
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Obtiene un usuario por su identificador.' })
  @ApiOkResponse({ description: 'Usuario encontrado.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  async findOne(@Param(ID_PARAM, ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(`:${ID_PARAM}`)
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Actualiza un usuario existente.' })
  @ApiOkResponse({ description: 'Usuario actualizado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiConflictResponse({ description: 'El correo electrónico ya está registrado.' })
  async update(@Param(ID_PARAM, ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(`:${ID_PARAM}`)
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un usuario por su identificador.' })
  @ApiNoContentResponse({ description: 'Usuario eliminado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  async remove(@Param(ID_PARAM, ParseUUIDPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
