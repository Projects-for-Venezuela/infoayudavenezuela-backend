import { Module } from '@nestjs/common';
import { NumerosEmergenciaService } from './numeros-emergencia.service';
import { NumerosEmergenciaController } from './numeros-emergencia.controller';

@Module({
  controllers: [NumerosEmergenciaController],
  providers: [NumerosEmergenciaService],
})
export class NumerosEmergenciaModule {}
