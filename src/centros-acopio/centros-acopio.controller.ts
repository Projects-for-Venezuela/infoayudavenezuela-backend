import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CentrosAcopioService } from './centros-acopio.service';
import { UpdateCentrosAcopioDto } from './dto/update-centros-acopio.dto';
import { PaginationCentrosAcopioDto } from './dto/pagination-centros-acopio.dto';
import { CreateCentroAcopioDto } from '~/centros-acopio/dto/create-centros-acopio.dto';

@ApiTags('Centros de Acopio')
@Controller('centros-acopio')
export class CentrosAcopioController {
  constructor(private readonly centrosAcopioService: CentrosAcopioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un centro de acopio',
  })
  @ApiCreatedResponse({
    description: 'Centro de acopio creado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor.',
  })
  async create(@Body() createCentroAcopioDto: CreateCentroAcopioDto) {
    return await this.centrosAcopioService.create(createCentroAcopioDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener centros de acopio paginados',
  })
  @ApiOkResponse({
    description: 'Centros de acopio obtenidos correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos.',
  })
  async pagination(@Query() paginationDto: PaginationCentrosAcopioDto) {
    return await this.centrosAcopioService.pagination(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener un centro de acopio por ID',
  })
  @ApiOkResponse({
    description: 'Centro de acopio obtenido correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'Centro de acopio no encontrado.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.centrosAcopioService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar un centro de acopio',
  })
  @ApiOkResponse({
    description: 'Centro de acopio actualizado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Centro de acopio no encontrado.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCentroAcopioDto: UpdateCentrosAcopioDto,
  ) {
    return await this.centrosAcopioService.update(id, updateCentroAcopioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un centro de acopio',
  })
  @ApiNoContentResponse({
    description: 'Centro de acopio eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'Centro de acopio no encontrado.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.centrosAcopioService.remove(id);
  }
}
