import { Module } from '@nestjs/common';
import { NecesidadesUrgentesService } from './necesidades-urgentes.service';
import { NecesidadesUrgentesController } from './necesidades-urgentes.controller';

@Module({
  controllers: [NecesidadesUrgentesController],
  providers: [NecesidadesUrgentesService],
})
export class NecesidadesUrgentesModule {}
