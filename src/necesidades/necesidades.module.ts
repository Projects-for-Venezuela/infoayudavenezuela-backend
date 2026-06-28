import { Module } from '@nestjs/common';
import { NecesidadesService } from './necesidades.service';
import { NecesidadesController } from './necesidades.controller';

@Module({
  controllers: [NecesidadesController],
  providers: [NecesidadesService],
})
export class NecesidadesModule {}
