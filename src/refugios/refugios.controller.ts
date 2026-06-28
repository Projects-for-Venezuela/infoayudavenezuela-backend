import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RefugiosService } from './refugios.service';
import { CreateRefugioDto } from './dto/create-refugio.dto';
import { UpdateRefugioDto } from './dto/update-refugio.dto';
import { PaginationRefugioDto } from './dto/pagination-refugio.dto';
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

@ApiTags('Refugios')
@Controller('refugios')
export class RefugiosController {
  constructor(private readonly refugiosService: RefugiosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo centro de refugio' })
  @ApiCreatedResponse({ description: 'Refugio creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createRefugioDto: CreateRefugioDto) {
    return this.refugiosService.create(createRefugioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de refugios paginados con filtros' })
  @ApiOkResponse({ description: 'Lista de refugios paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationRefugioDto: PaginationRefugioDto) {
    return this.refugiosService.pagination(paginationRefugioDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugio encontrado.' })
  @ApiNotFoundResponse({ description: 'Refugio no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio a actualizar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugio actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiNotFoundResponse({ description: 'Refugio no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRefugioDto: UpdateRefugioDto) {
    return this.refugiosService.update(id, updateRefugioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio a eliminar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugio eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene refugiados asociados.' })
  @ApiNotFoundResponse({ description: 'Refugio no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiosService.remove(id);
  }
}
