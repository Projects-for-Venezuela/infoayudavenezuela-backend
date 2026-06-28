import { Module } from '@nestjs/common';
import { RefugiadosService } from './refugiados.service';
import { RefugiadosController } from './refugiados.controller';

@Module({
  controllers: [RefugiadosController],
  providers: [RefugiadosService],
})
export class RefugiadosModule {}
