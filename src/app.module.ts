import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentrosAcopioModule } from '~/centros-acopio/centros-acopio.module';
import { CiudadesModule } from '~/ciudades/ciudades.module';
import { DatabaseModule } from '~/database/database.module';
import { EstadosModule } from '~/estados/estados.module';
import { RefugiadosModule } from '~/refugiados/refugiados.module';
import { RefugiosModule } from '~/refugios/refugios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CentrosAcopioModule,
    EstadosModule,
    CiudadesModule,
    RefugiosModule,
    RefugiadosModule,
  ],
})
export class AppModule {}

