import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { DbModule } from 'src/db/db.module';
import { CompanyController } from './company.controller';
import { BusinessHoursModule } from 'src/business-hours/business-hours.module';

@Module({
  imports: [DbModule, BusinessHoursModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}