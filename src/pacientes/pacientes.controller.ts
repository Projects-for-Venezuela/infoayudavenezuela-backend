import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PaginationPacienteDto } from './dto/pagination-paciente.dto';
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

@ApiTags('Pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo paciente' })
  @ApiCreatedResponse({ description: 'Paciente registrado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de pacientes paginados con filtros' })
  @ApiOkResponse({ description: 'Lista de pacientes paginada.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  pagination(@Query() paginationPacienteDto: PaginationPacienteDto) {
    return this.pacientesService.pagination(paginationPacienteDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paciente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del paciente' })
  @ApiOkResponse({ description: 'Paciente encontrado.' })
  @ApiNotFoundResponse({ description: 'Paciente no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un paciente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del paciente a actualizar' })
  @ApiOkResponse({ description: 'Paciente actualizado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o referencias inexistentes.' })
  @ApiNotFoundResponse({ description: 'Paciente no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un paciente por su ID (UUID)' })
  @ApiParam({ name: 'id', description: 'UUID del paciente a eliminar' })
  @ApiOkResponse({ description: 'Paciente eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Paciente no encontrado.' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.remove(id);
  }
}
