import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HospitalesService } from './hospitales.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { PaginationHospitalDto } from './dto/pagination-hospital.dto';
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

@ApiTags('Hospitales')
@Controller('hospitales')
export class HospitalesController {
  constructor(private readonly hospitalesService: HospitalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo hospital' })
  @ApiCreatedResponse({ description: 'Hospital creado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o ciudad inexistente.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalesService.create(createHospitalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de hospitales paginados' })
  @ApiOkResponse({ description: 'Lista de hospitales paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationHospitalDto: PaginationHospitalDto) {
    return this.hospitalesService.pagination(paginationHospitalDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un hospital por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del hospital' })
  @ApiOkResponse({ description: 'Hospital encontrado.' })
  @ApiNotFoundResponse({ description: 'Hospital no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un hospital por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del hospital a actualizar' })
  @ApiOkResponse({ description: 'Hospital actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o ciudad inexistente.' })
  @ApiNotFoundResponse({ description: 'Hospital no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalesService.update(id, updateHospitalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un hospital por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del hospital a eliminar' })
  @ApiOkResponse({ description: 'Hospital eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'No se puede eliminar, tiene pacientes asociados.' })
  @ApiNotFoundResponse({ description: 'Hospital no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalesService.remove(id);
  }
}
