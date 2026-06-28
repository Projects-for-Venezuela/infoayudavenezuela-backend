import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EstadosAliasService } from './estados-alias.service';
import { CreateEstadoAliasDto } from './dto/create-estado-alias.dto';
import { UpdateEstadoAliasDto } from './dto/update-estado-alias.dto';
import { PaginationEstadoAliasDto } from './dto/pagination-estado-alias.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('Alias de Estados')
@Controller('estados-alias')
export class EstadosAliasController {
  constructor(private readonly service: EstadosAliasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alias de estado' })
  @ApiCreatedResponse({ description: 'Alias creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o alias duplicado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateEstadoAliasDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de alias paginados' })
  @ApiOkResponse({ description: 'Lista de alias paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationEstadoAliasDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alias por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del alias' })
  @ApiOkResponse({ description: 'Alias encontrado.' })
  @ApiNotFoundResponse({ description: 'Alias no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un alias por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del alias a actualizar' })
  @ApiOkResponse({ description: 'Alias actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o alias duplicado.' })
  @ApiNotFoundResponse({ description: 'Alias no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEstadoAliasDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un alias por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del alias a eliminar' })
  @ApiOkResponse({ description: 'Alias eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Alias no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
