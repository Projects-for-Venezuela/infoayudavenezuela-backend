import { Module } from '@nestjs/common';
import { EstadosAliasService } from './estados-alias.service';
import { EstadosAliasController } from './estados-alias.controller';

@Module({
  controllers: [EstadosAliasController],
  providers: [EstadosAliasService],
})
export class EstadosAliasModule {}
