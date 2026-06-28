import { Module } from '@nestjs/common';
import { TiposNumeroEmergenciaService } from './tipos-numero-emergencia.service';
import { TiposNumeroEmergenciaController } from './tipos-numero-emergencia.controller';

@Module({
  controllers: [TiposNumeroEmergenciaController],
  providers: [TiposNumeroEmergenciaService],
})
export class TiposNumeroEmergenciaModule {}
