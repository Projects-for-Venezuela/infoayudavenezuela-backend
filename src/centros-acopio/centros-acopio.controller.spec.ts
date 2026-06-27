import { Test, TestingModule } from '@nestjs/testing';
import { CentrosAcopioController } from './centros-acopio.controller';
import { CentrosAcopioService } from './centros-acopio.service';

describe('CentrosAcopioController', () => {
  let controller: CentrosAcopioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CentrosAcopioController],
      providers: [CentrosAcopioService],
    }).compile();

    controller = module.get<CentrosAcopioController>(CentrosAcopioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
