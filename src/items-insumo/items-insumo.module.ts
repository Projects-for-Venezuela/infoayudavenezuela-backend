import { Module } from '@nestjs/common';
import { ItemsInsumoService } from './items-insumo.service';
import { ItemsInsumoController } from './items-insumo.controller';

@Module({
  controllers: [ItemsInsumoController],
  providers: [ItemsInsumoService],
})
export class ItemsInsumoModule {}
