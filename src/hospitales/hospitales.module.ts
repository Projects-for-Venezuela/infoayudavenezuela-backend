import { Module } from '@nestjs/common';
import { HospitalesService } from './hospitales.service';
import { HospitalesController } from './hospitales.controller';

@Module({
  controllers: [HospitalesController],
  providers: [HospitalesService],
})
export class HospitalesModule {}
