import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { DbModule } from 'src/db/db.module';
import { CompanyController } from './company.controller';
import { BusinessHoursModule } from 'src/business-hours/business-hours.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [DbModule, BusinessHoursModule, ResourcesModule, OrderModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
