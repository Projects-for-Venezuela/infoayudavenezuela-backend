import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { CentrosAcopioModule } from '~/centros-acopio/centros-acopio.module';
import { CiudadesModule } from '~/ciudades/ciudades.module';
import { DatabaseModule } from '~/database/database.module';
import { EnlacesAyudaModule } from '~/enlaces-ayuda/enlaces-ayuda.module';
import { EstadosModule } from '~/estados/estados.module';
import { HospitalesModule } from '~/hospitales/hospitales.module';
import { InsumosGeneralesModule } from '~/insumos-generales/insumos-generales.module';
import { ItemsInsumoModule } from '~/items-insumo/items-insumo.module';
import { CategoriasInsumosModule } from '~/categorias-insumos/categorias-insumos.module';
import { NecesidadesUrgentesModule } from '~/necesidades-urgentes/necesidades-urgentes.module';
import { NoticiasModule } from '~/noticias/noticias.module';
import { NumerosEmergenciaModule } from '~/numeros-emergencia/numeros-emergencia.module';
import { PacientesModule } from '~/pacientes/pacientes.module';
import { RefugiadosModule } from '~/refugiados/refugiados.module';
import { RefugiosModule } from '~/refugios/refugios.module';
import { TiposNumeroEmergenciaModule } from '~/tipos-numero-emergencia/tipos-numero-emergencia.module';
import { EstadosAliasModule } from '~/estados-alias/estados-alias.module';
import { EstadosAyudaModule } from '~/estados-ayuda/estados-ayuda.module';

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
    CategoriasInsumosModule,
    CentrosAcopioModule,
    CiudadesModule,
    EnlacesAyudaModule,
    EstadosModule,
    HospitalesModule,
    InsumosGeneralesModule,
    ItemsInsumoModule,
    NecesidadesUrgentesModule,
    NoticiasModule,
    NumerosEmergenciaModule,
    PacientesModule,
    RefugiadosModule,
    RefugiosModule,
    TiposNumeroEmergenciaModule,
    EstadosAliasModule,
    EstadosAyudaModule,
  ],
})
export class AppModule {}

