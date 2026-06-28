import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriasInsumosService } from './categorias-insumos.service';
import { CreateCategoriaInsumoDto } from './dto/create-categoria-insumo.dto';
import { UpdateCategoriaInsumoDto } from './dto/update-categoria-insumo.dto';
import { PaginationCategoriaInsumoDto } from './dto/pagination-categoria-insumo.dto';
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

@ApiTags('Categorías de Insumos')
@Controller('categorias-insumos')
export class CategoriasInsumosController {
  constructor(private readonly service: CategoriasInsumosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría de insumo' })
  @ApiCreatedResponse({ description: 'Categoría creada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o slug duplicado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateCategoriaInsumoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de categorías paginadas' })
  @ApiOkResponse({ description: 'Lista de categorías paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationCategoriaInsumoDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la categoría' })
  @ApiOkResponse({ description: 'Categoría encontrada.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoría por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la categoría a actualizar' })
  @ApiOkResponse({ description: 'Categoría actualizada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o slug duplicado.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoriaInsumoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una categoría por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la categoría a eliminar' })
  @ApiOkResponse({ description: 'Categoría eliminada correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene items asociados.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
