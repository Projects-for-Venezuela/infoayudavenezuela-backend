import { Module } from '@nestjs/common';
import { RefugiosService } from './refugios.service';
import { RefugiosController } from './refugios.controller';

@Module({
  controllers: [RefugiosController],
  providers: [RefugiosService],
})
export class RefugiosModule {}
