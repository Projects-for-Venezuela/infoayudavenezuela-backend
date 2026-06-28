import { Module } from '@nestjs/common';
import { EnlacesAyudaService } from './enlaces-ayuda.service';
import { EnlacesAyudaController } from './enlaces-ayuda.controller';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EnlacesAyudaService],
  controllers: [EnlacesAyudaController],
})
export class EnlacesAyudaModule {}
