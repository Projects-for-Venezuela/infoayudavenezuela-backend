import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ItemsInsumoService } from './items-insumo.service';
import { CreateItemInsumoDto } from './dto/create-item-insumo.dto';
import { UpdateItemInsumoDto } from './dto/update-item-insumo.dto';
import { PaginationItemInsumoDto } from './dto/pagination-item-insumo.dto';
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

@ApiTags('Items de Insumo')
@Controller('items-insumo')
export class ItemsInsumoController {
  constructor(private readonly service: ItemsInsumoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo item de insumo' })
  @ApiCreatedResponse({ description: 'Item de insumo creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o categoría inexistente.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateItemInsumoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de items de insumo paginados' })
  @ApiOkResponse({ description: 'Lista de items paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationItemInsumoDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item de insumo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del item de insumo' })
  @ApiOkResponse({ description: 'Item de insumo encontrado.' })
  @ApiNotFoundResponse({ description: 'Item de insumo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un item de insumo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del item de insumo a actualizar' })
  @ApiOkResponse({ description: 'Item de insumo actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o categoría inexistente.' })
  @ApiNotFoundResponse({ description: 'Item de insumo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemInsumoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un item de insumo por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del item de insumo a eliminar' })
  @ApiOkResponse({ description: 'Item de insumo eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Item de insumo no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
