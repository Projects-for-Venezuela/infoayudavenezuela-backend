import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EnlacesAyudaService } from './enlaces-ayuda.service';
import { CreateEnlaceAyudaDto } from './dto/create-enlace-ayuda.dto';
import { UpdateEnlaceAyudaDto } from './dto/update-enlace-ayuda.dto';
import { PaginationEnlaceAyudaDto } from './dto/pagination-enlace-ayuda.dto';
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

@ApiTags('Enlaces de Ayuda')
@Controller('enlaces-ayuda')
export class EnlacesAyudaController {
  constructor(private readonly service: EnlacesAyudaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo enlace de ayuda' })
  @ApiCreatedResponse({ description: 'Enlace creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o URL duplicada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() dto: CreateEnlaceAyudaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de enlaces paginada con filtros' })
  @ApiOkResponse({ description: 'Lista de enlaces paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationDto: PaginationEnlaceAyudaDto) {
    return this.service.pagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un enlace por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del enlace' })
  @ApiOkResponse({ description: 'Enlace encontrado.' })
  @ApiNotFoundResponse({ description: 'Enlace no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un enlace por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del enlace a actualizar' })
  @ApiOkResponse({ description: 'Enlace actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o URL duplicada.' })
  @ApiNotFoundResponse({ description: 'Enlace no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateEnlaceAyudaDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un enlace por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del enlace a eliminar' })
  @ApiOkResponse({ description: 'Enlace eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene registros asociados.' })
  @ApiNotFoundResponse({ description: 'Enlace no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
