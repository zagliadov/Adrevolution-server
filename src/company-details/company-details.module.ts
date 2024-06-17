import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CompanyDetailsController } from './company-details.controller';
import { CompanyDetailsService } from './company-details.service';
import { TransportationModule } from 'src/transportation/transportation.module';

@Module({
  imports: [DbModule, TransportationModule],
  controllers: [CompanyDetailsController],
  providers: [CompanyDetailsService],
  exports: [CompanyDetailsService],
})
export class CompanyDetailsModule {}
