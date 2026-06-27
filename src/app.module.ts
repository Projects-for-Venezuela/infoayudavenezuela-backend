import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentrosAcopioModule } from '~/centros-acopio/centros-acopio.module';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, CentrosAcopioModule],
})
export class AppModule {}
