import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TiposNumeroEmergenciaService } from './tipos-numero-emergencia.service';
import { CreateTipoNumeroEmergenciaDto } from './dto/create-tipo-numero-emergencia.dto';
import { UpdateTipoNumeroEmergenciaDto } from './dto/update-tipo-numero-emergencia.dto';
import { PaginationTipoNumeroEmergenciaDto } from './dto/pagination-tipo-numero-emergencia.dto';
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

@ApiTags('Tipos de Número de Emergencia')
@Controller('tipos-numero-emergencia')
export class TiposNumeroEmergenciaController {
  constructor(private readonly service: TiposNumeroEmergenciaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de número de emergencia' })
  @ApiCreatedResponse({ description: 'Tipo creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o slug duplicado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateTipoNumeroEmergenciaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de tipos paginados' })
  @ApiOkResponse({ description: 'Lista de tipos paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationTipoNumeroEmergenciaDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del tipo' })
  @ApiOkResponse({ description: 'Tipo encontrado.' })
  @ApiNotFoundResponse({ description: 'Tipo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del tipo a actualizar' })
  @ApiOkResponse({ description: 'Tipo actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o slug duplicado.' })
  @ApiNotFoundResponse({ description: 'Tipo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTipoNumeroEmergenciaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un tipo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del tipo a eliminar' })
  @ApiOkResponse({ description: 'Tipo eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene números asociados.' })
  @ApiNotFoundResponse({ description: 'Tipo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
