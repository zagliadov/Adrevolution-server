import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CompanyDetailsController } from './company-details.controller';
import { CompanyDetailsService } from './company-details.service';

@Module({
  imports: [DbModule],
  controllers: [CompanyDetailsController],
  providers: [CompanyDetailsService],
  exports: [CompanyDetailsService],
})
export class CompanyDetailsModule {}
