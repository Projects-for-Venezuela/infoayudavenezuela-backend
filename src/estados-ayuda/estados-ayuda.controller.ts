import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EstadosAyudaService } from './estados-ayuda.service';
import { CreateEstadosAyudaDto } from './dto/create-estados-ayuda.dto';
import { UpdateEstadosAyudaDto } from './dto/update-estados-ayuda.dto';
import { PaginationEstadosAyudaDto } from './dto/pagination-estados-ayuda.dto';
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

@ApiTags('Nivel de Ayuda de Estados')
@Controller('estados-ayuda')
export class EstadosAyudaController {
  constructor(private readonly service: EstadosAyudaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de ayuda para un estado' })
  @ApiCreatedResponse({ description: 'Registro de ayuda creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o el estado no existe.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateEstadosAyudaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de registros de ayuda paginados' })
  @ApiOkResponse({ description: 'Lista de registros de ayuda paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationEstadosAyudaDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':estadoId')
  @ApiOperation({ summary: 'Obtener un registro de ayuda por ID de estado (UUID)' })
  @ApiParam({ name: 'estadoId', description: 'UUID del estado' })
  @ApiOkResponse({ description: 'Registro de ayuda encontrado.' })
  @ApiNotFoundResponse({ description: 'Registro de ayuda no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('estadoId', ParseUUIDPipe) estadoId: string) {
    return this.service.findOne(estadoId);
  }

  @Put(':estadoId')
  @ApiOperation({ summary: 'Actualizar un registro de ayuda por ID de estado (UUID)' })
  @ApiParam({ name: 'estadoId', description: 'UUID del estado a actualizar' })
  @ApiOkResponse({ description: 'Registro de ayuda actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Registro de ayuda no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('estadoId', ParseUUIDPipe) estadoId: string, @Body() dto: UpdateEstadosAyudaDto) {
    return this.service.update(estadoId, dto);
  }

  @Delete(':estadoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un registro de ayuda por ID de estado (UUID)' })
  @ApiParam({ name: 'estadoId', description: 'UUID del estado a eliminar' })
  @ApiOkResponse({ description: 'Registro de ayuda eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Registro de ayuda no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('estadoId', ParseUUIDPipe) estadoId: string) {
    return this.service.remove(estadoId);
  }
}
