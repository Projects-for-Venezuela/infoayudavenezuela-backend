import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PaginationEstadoDto } from './dto/pagination-estado.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiResponse({ status: 201, description: 'Estado creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o nombre duplicado.' })
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de estados paginados con búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de estados paginada.' })
  pagination(@Query() paginationEstadoDto: PaginationEstadoDto) {
    return this.estadosService.pagination(paginationEstadoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado por su ID (UUID) con sus ciudades' })
  @ApiParam({ name: 'id', description: 'UUID del estado', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Estado encontrado.' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del estado a actualizar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Estado actualizado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o nombre duplicado.' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadosService.update(id, updateEstadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un estado por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del estado a eliminar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Estado eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar, tiene registros asociados.' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosService.remove(id);
  }
}
