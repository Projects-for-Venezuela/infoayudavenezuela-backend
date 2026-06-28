import { Module } from '@nestjs/common';
import { EstadosAyudaService } from './estados-ayuda.service';
import { EstadosAyudaController } from './estados-ayuda.controller';

@Module({
  controllers: [EstadosAyudaController],
  providers: [EstadosAyudaService],
})
export class EstadosAyudaModule {}
