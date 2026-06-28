import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { PaginationCiudadDto } from './dto/pagination-ciudad.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Ciudades')
@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva ciudad' })
  @ApiResponse({ status: 201, description: 'Ciudad creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos, estado inexistente o ciudad duplicada.' })
  create(@Body() createCiudadDto: CreateCiudadDto) {
    return this.ciudadesService.create(createCiudadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de ciudades paginadas con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de ciudades paginada.' })
  pagination(@Query() paginationCiudadDto: PaginationCiudadDto) {
    return this.ciudadesService.pagination(paginationCiudadDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ciudad por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la ciudad', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @ApiResponse({ status: 200, description: 'Ciudad encontrada.' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ciudadesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la ciudad a actualizar', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @ApiResponse({ status: 200, description: 'Ciudad actualizada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos, estado inexistente o ciudad duplicada.' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCiudadDto: UpdateCiudadDto) {
    return this.ciudadesService.update(id, updateCiudadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una ciudad por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID de la ciudad a eliminar', example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @ApiResponse({ status: 200, description: 'Ciudad eliminada con éxito.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar, tiene registros asociados.' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ciudadesService.remove(id);
  }
}
