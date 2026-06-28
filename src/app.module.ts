import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { CentrosAcopioModule } from '~/centros-acopio/centros-acopio.module';
import { CiudadesModule } from '~/ciudades/ciudades.module';
import { DatabaseModule } from '~/database/database.module';
import { EstadosModule } from '~/estados/estados.module';
import { RefugiadosModule } from '~/refugiados/refugiados.module';
import { RefugiosModule } from '~/refugios/refugios.module';
import { NoticiasModule } from '~/noticias/noticias.module';
import { EnlacesAyudaModule } from '~/enlaces-ayuda/enlaces-ayuda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('THROTTLE_TTL'),
            limit: config.getOrThrow<number>('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),

    DatabaseModule,
    CentrosAcopioModule,
    EstadosModule,
    CiudadesModule,
    RefugiosModule,
    RefugiadosModule,
    NoticiasModule,
    EnlacesAyudaModule,
  ],
})
export class AppModule {}

