import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { InsumosGeneralesService } from './insumos-generales.service';
import { CreateInsumoGeneralDto } from './dto/create-insumo-general.dto';
import { UpdateInsumoGeneralDto } from './dto/update-insumo-general.dto';
import { PaginationInsumoGeneralDto } from './dto/pagination-insumo-general.dto';
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

@ApiTags('Insumos Generales')
@Controller('insumos-generales')
export class InsumosGeneralesController {
  constructor(private readonly service: InsumosGeneralesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo insumo general' })
  @ApiCreatedResponse({ description: 'Insumo general creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateInsumoGeneralDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de insumos generales paginados' })
  @ApiOkResponse({ description: 'Lista de insumos paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationInsumoGeneralDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un insumo general por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del insumo general' })
  @ApiOkResponse({ description: 'Insumo general encontrado.' })
  @ApiNotFoundResponse({ description: 'Insumo general no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un insumo general por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del insumo general a actualizar' })
  @ApiOkResponse({ description: 'Insumo general actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Insumo general no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInsumoGeneralDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un insumo general por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del insumo general a eliminar' })
  @ApiOkResponse({ description: 'Insumo general eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Insumo general no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
