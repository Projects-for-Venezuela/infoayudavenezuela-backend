import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NecesidadesService } from './necesidades.service';
import { CreateNecesidadeDto } from './dto/create-necesidade.dto';
import { UpdateNecesidadeDto } from './dto/update-necesidade.dto';
import { PaginationNecesidadeDto } from './dto/pagination-necesidade.dto';

@ApiTags('Necesidades Urgentes')
@Controller('necesidades')
export class NecesidadesController {
  constructor(private readonly necesidadesService: NecesidadesService) {}

  @Get('estados')
  @ApiOperation({
    summary: 'Estados disponibles para filtrar necesidades',
    description: 'Devuelve solo Distrito Capital, La Guaira, Miranda y Falcón.',
  })
  selectEstado() {
    return this.necesidadesService.selectCiudad();
  }

  @Get('verificados')
  @ApiOperation({
    summary: 'Listado paginado de necesidades verificadas',
    description: 'Usa el helper de paginación y muestra solo las verificadas.',
  })
  findAllVerified(@Query() paginationDto: PaginationNecesidadeDto) {
    return this.necesidadesService.findAllVerified(paginationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listado paginado de todas las necesidades',
    description: 'Usa el helper de paginación y muestra verificadas y no verificadas.',
  })
  findAllPaginated(@Query() paginationDto: PaginationNecesidadeDto) {
    return this.necesidadesService.findAllPaginated(paginationDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Registra una necesidad urgente',
    description: 'Se crea siempre con verificado = false.',
  })
  create(@Body() createNecesidadeDto: CreateNecesidadeDto) {
    return this.necesidadesService.create(createNecesidadeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una necesidad por su id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.necesidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una necesidad' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateNecesidadeDto: UpdateNecesidadeDto) {
    return this.necesidadesService.update(id, updateNecesidadeDto);
  }

  @Patch(':id/verificar')
  @ApiOperation({
    summary: 'Verifica una necesidad',
    description: 'Servicio independiente que cambia el estado verificado a true.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  verificar(@Param('id', ParseUUIDPipe) id: string) {
    return this.necesidadesService.verificar(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una necesidad' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.necesidadesService.remove(id);
  }
}
