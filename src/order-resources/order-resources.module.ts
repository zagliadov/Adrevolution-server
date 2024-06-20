import { Module } from '@nestjs/common';
import { OrderResourcesController } from './order-resources.controller';
import { OrderResourcesService } from './order-resources.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OrderResourcesController],
  providers: [OrderResourcesService],
  exports: [OrderResourcesService],
})
export class OrderResourcesModule {}
