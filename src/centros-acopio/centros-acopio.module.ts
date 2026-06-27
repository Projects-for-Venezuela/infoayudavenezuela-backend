import { Module } from '@nestjs/common';
import { CentrosAcopioService } from './centros-acopio.service';
import { CentrosAcopioController } from './centros-acopio.controller';

@Module({
  controllers: [CentrosAcopioController],
  providers: [CentrosAcopioService],
})
export class CentrosAcopioModule {}
