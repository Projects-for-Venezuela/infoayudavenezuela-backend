import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NumerosEmergenciaService } from './numeros-emergencia.service';
import { CreateNumeroEmergenciaDto } from './dto/create-numero-emergencia.dto';
import { UpdateNumeroEmergenciaDto } from './dto/update-numero-emergencia.dto';
import { PaginationNumeroEmergenciaDto } from './dto/pagination-numero-emergencia.dto';
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

@ApiTags('Números de Emergencia')
@Controller('numeros-emergencia')
export class NumerosEmergenciaController {
  constructor(private readonly service: NumerosEmergenciaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo número de emergencia' })
  @ApiCreatedResponse({ description: 'Número de emergencia creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateNumeroEmergenciaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de números de emergencia paginados' })
  @ApiOkResponse({ description: 'Lista de números de emergencia paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationNumeroEmergenciaDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un número de emergencia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del número de emergencia' })
  @ApiOkResponse({ description: 'Número de emergencia encontrado.' })
  @ApiNotFoundResponse({ description: 'Número de emergencia no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un número de emergencia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del número de emergencia a actualizar' })
  @ApiOkResponse({ description: 'Número de emergencia actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiNotFoundResponse({ description: 'Número de emergencia no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNumeroEmergenciaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un número de emergencia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del número de emergencia a eliminar' })
  @ApiOkResponse({ description: 'Número de emergencia eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Número de emergencia no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
