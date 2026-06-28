import { Module } from '@nestjs/common';
import { InsumosGeneralesService } from './insumos-generales.service';
import { InsumosGeneralesController } from './insumos-generales.controller';

@Module({
  controllers: [InsumosGeneralesController],
  providers: [InsumosGeneralesService],
})
export class InsumosGeneralesModule {}
