import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RefugiosService } from './refugios.service';
import { CreateRefugioDto } from './dto/create-refugio.dto';
import { UpdateRefugioDto } from './dto/update-refugio.dto';
import { PaginationRefugioDto } from './dto/pagination-refugio.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Refugios')
@Controller('refugios')
export class RefugiosController {
  constructor(private readonly refugiosService: RefugiosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo centro de refugio' })
  @ApiResponse({ status: 201, description: 'Refugio creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o referencias inexistentes.' })
  create(@Body() createRefugioDto: CreateRefugioDto) {
    return this.refugiosService.create(createRefugioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de refugios paginados con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de refugios paginada.' })
  pagination(@Query() paginationRefugioDto: PaginationRefugioDto) {
    return this.refugiosService.pagination(paginationRefugioDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Refugio encontrado.' })
  @ApiResponse({ status: 404, description: 'Refugio no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio a actualizar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Refugio actualizado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o referencias inexistentes.' })
  @ApiResponse({ status: 404, description: 'Refugio no encontrado.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRefugioDto: UpdateRefugioDto) {
    return this.refugiosService.update(id, updateRefugioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un refugio por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del refugio a eliminar', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Refugio eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar, tiene refugiados asociados.' })
  @ApiResponse({ status: 404, description: 'Refugio no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.refugiosService.remove(id);
  }
}
