import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NecesidadesUrgentesService } from './necesidades-urgentes.service';
import { CreateNecesidadUrgenteDto } from './dto/create-necesidad-urgente.dto';
import { UpdateNecesidadUrgenteDto } from './dto/update-necesidad-urgente.dto';
import { PaginationNecesidadUrgenteDto } from './dto/pagination-necesidad-urgente.dto';
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

@ApiTags('Necesidades Urgentes')
@Controller('necesidades-urgentes')
export class NecesidadesUrgentesController {
  constructor(private readonly service: NecesidadesUrgentesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva necesidad urgente' })
  @ApiCreatedResponse({ description: 'Necesidad urgente creada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateNecesidadUrgenteDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de necesidades urgentes paginadas' })
  @ApiOkResponse({ description: 'Lista de necesidades urgentes paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationNecesidadUrgenteDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una necesidad urgente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la necesidad urgente' })
  @ApiOkResponse({ description: 'Necesidad urgente encontrada.' })
  @ApiNotFoundResponse({ description: 'Necesidad urgente no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una necesidad urgente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la necesidad urgente a actualizar' })
  @ApiOkResponse({ description: 'Necesidad urgente actualizada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiNotFoundResponse({ description: 'Necesidad urgente no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNecesidadUrgenteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una necesidad urgente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la necesidad urgente a eliminar' })
  @ApiOkResponse({ description: 'Necesidad urgente eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Necesidad urgente no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
