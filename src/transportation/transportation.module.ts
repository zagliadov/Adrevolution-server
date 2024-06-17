import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { TransportationController } from './transportation.controller';
import { TransportationService } from './transportation.service';

@Module({
  imports: [DbModule],
  controllers: [TransportationController],
  providers: [TransportationService],
  exports: [TransportationService],
})
export class TransportationModule {}
