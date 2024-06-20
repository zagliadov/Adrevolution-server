import { Module } from '@nestjs/common';
import { OrderCompaniesService } from './order-companies.service';
import { OrderCompaniesController } from './order-companies.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OrderCompaniesController],
  providers: [OrderCompaniesService],
  exports: [OrderCompaniesService],
})
export class OrderCompaniesModule {}
