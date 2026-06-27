import { Injectable } from '@nestjs/common';
import { CreateCentrosAcopioDto } from './dto/create-centros-acopio.dto';
import { UpdateCentrosAcopioDto } from './dto/update-centros-acopio.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CentrosAcopioService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createCentrosAcopioDto: CreateCentrosAcopioDto) {
    return 'This action adds a new centrosAcopio';
  }

  async findAll() {
    return await this.databaseService.centros_acopio.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} centrosAcopio`;
  }

  update(id: number, updateCentrosAcopioDto: UpdateCentrosAcopioDto) {
    return `This action updates a #${id} centrosAcopio`;
  }

  remove(id: number) {
    return `This action removes a #${id} centrosAcopio`;
  }
}
