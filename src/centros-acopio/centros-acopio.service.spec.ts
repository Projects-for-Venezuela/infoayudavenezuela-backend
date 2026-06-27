import { Test, TestingModule } from '@nestjs/testing';
import { CentrosAcopioService } from './centros-acopio.service';

describe('CentrosAcopioService', () => {
  let service: CentrosAcopioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentrosAcopioService],
    }).compile();

    service = module.get<CentrosAcopioService>(CentrosAcopioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
