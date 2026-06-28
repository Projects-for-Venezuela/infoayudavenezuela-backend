import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CentrosAcopioService } from './centros-acopio.service';
import { CreateCentrosAcopioDto } from './dto/create-centros-acopio.dto';
import { UpdateCentrosAcopioDto } from './dto/update-centros-acopio.dto';
import { PaginationCentrosAcopioDto } from './dto/pagination-centros-acopio.dto';

@Controller('centros-acopio')
export class CentrosAcopioController {
  constructor(private readonly centrosAcopioService: CentrosAcopioService) {}

  @Post()
  create(@Body() createCentrosAcopioDto: CreateCentrosAcopioDto) {
    return this.centrosAcopioService.create(createCentrosAcopioDto);
  }

  @Get()
  Pagination(@Query() paginationDto: PaginationCentrosAcopioDto) {
    return this.centrosAcopioService.pagination(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.centrosAcopioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCentrosAcopioDto: UpdateCentrosAcopioDto) {
    return this.centrosAcopioService.update(+id, updateCentrosAcopioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centrosAcopioService.remove(+id);
  }
}
