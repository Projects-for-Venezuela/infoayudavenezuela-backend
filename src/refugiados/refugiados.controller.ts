import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RefugiadosService } from './refugiados.service';
import { CreateRefugiadoDto } from './dto/create-refugiado.dto';
import { UpdateRefugiadoDto } from './dto/update-refugiado.dto';
import { PaginationRefugiadoDto } from './dto/pagination-refugiado.dto';
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

@ApiTags('Refugiados')
@Controller('refugiados')
export class RefugiadosController {
  constructor(private readonly refugiadosService: RefugiadosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo refugiado' })
  @ApiCreatedResponse({ description: 'Refugiado registrado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createRefugiadoDto: CreateRefugiadoDto) {
    return this.refugiadosService.create(createRefugiadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de refugiados paginados con filtros' })
  @ApiOkResponse({ description: 'Lista de refugiados paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationRefugiadoDto: PaginationRefugiadoDto) {
    return this.refugiadosService.pagination(paginationRefugiadoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un refugiado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugiado', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugiado encontrado.' })
  @ApiNotFoundResponse({ description: 'Refugiado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiadosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un refugiado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugiado a actualizar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugiado actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiNotFoundResponse({ description: 'Refugiado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRefugiadoDto: UpdateRefugiadoDto) {
    return this.refugiadosService.update(id, updateRefugiadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un refugiado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugiado a eliminar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiOkResponse({ description: 'Refugiado eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Refugiado no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiadosService.remove(id);
  }
}
