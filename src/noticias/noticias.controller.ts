import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { PaginationNoticiaDto } from './dto/pagination-noticia.dto';
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

@ApiTags('Noticias')
@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva noticia' })
  @ApiCreatedResponse({ description: 'Noticia creada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o relaciones inválidas.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createNoticiaDto: CreateNoticiaDto) {
    return this.noticiasService.create(createNoticiaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de noticias paginadas con filtros' })
  @ApiOkResponse({ description: 'Lista de noticias paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationNoticiaDto: PaginationNoticiaDto) {
    return this.noticiasService.pagination(paginationNoticiaDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una noticia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la noticia' })
  @ApiOkResponse({ description: 'Noticia encontrada.' })
  @ApiNotFoundResponse({ description: 'Noticia no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.noticiasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una noticia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la noticia a actualizar' })
  @ApiOkResponse({ description: 'Noticia actualizada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o relaciones inválidas.' })
  @ApiNotFoundResponse({ description: 'Noticia no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updateNoticiaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una noticia por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la noticia a eliminar' })
  @ApiOkResponse({ description: 'Noticia eliminada correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene registros asociados.' })
  @ApiNotFoundResponse({ description: 'Noticia no encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.noticiasService.remove(id);
  }
}
