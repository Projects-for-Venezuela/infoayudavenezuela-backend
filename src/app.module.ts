import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentrosAcopioModule } from '~/centros-acopio/centros-acopio.module';
import { DatabaseModule } from '~/database/database.module';
import { NecesidadesModule } from './necesidades/necesidades.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule, 
    CentrosAcopioModule, 
    NecesidadesModule
  ],
})
export class AppModule {}
