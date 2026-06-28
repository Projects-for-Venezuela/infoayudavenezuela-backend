import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PaginationEstadoDto } from './dto/pagination-estado.dto';
import { QueryEstadoDto } from './dto/query-estado.dto';
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

@ApiTags('Estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiCreatedResponse({ description: 'Estado creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o nombre duplicado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de estados paginados con búsqueda' })
  @ApiOkResponse({ description: 'Lista de estados paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationEstadoDto: PaginationEstadoDto) {
    return this.estadosService.pagination(paginationEstadoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado por su ID (UUID) con sus ciudades' })
  @ApiParam({ name: 'id', description: 'UUID del estado', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Estado encontrado.' })
  @ApiNotFoundResponse({ description: 'Estado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Query() queryDto: QueryEstadoDto) {
    return this.estadosService.findOne(id, queryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del estado a actualizar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Estado actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o nombre duplicado.' })
  @ApiNotFoundResponse({ description: 'Estado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadosService.update(id, updateEstadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un estado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del estado a eliminar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Estado eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene registros asociados.' })
  @ApiNotFoundResponse({ description: 'Estado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosService.remove(id);
  }
}
