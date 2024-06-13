import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { CompanyController } from './company/company.controller';
import { CompanyService } from './company/company.service';
import { CompanyModule } from './company/company.module';
import { CompanyDetailsController } from './company-details/company-details.controller';
import { CompanyDetailsService } from './company-details/company-details.service';
import { CompanyDetailsModule } from './company-details/company-details.module';
import { BusinessHoursController } from './business-hours/business-hours.controller';
import { BusinessHoursService } from './business-hours/business-hours.service';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionsModule } from './permissions/permissions.module';
import { LabourCostController } from './labour-cost/labour-cost.controller';
import { LabourCostService } from './labour-cost/labour-cost.service';
import { LabourCostModule } from './labour-cost/labour-cost.module';
import { CommunicationsController } from './communications/communications.controller';
import { CommunicationsService } from './communications/communications.service';
import { CommunicationsModule } from './communications/communications.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    UsersModule,
    AccountModule,
    CompanyModule,
    CompanyDetailsModule,
    BusinessHoursModule,
    PermissionsModule,
    LabourCostModule,
    CommunicationsModule,
  ],
  controllers: [
    AppController,
    CompanyController,
    CompanyDetailsController,
    BusinessHoursController,
    PermissionsController,
    LabourCostController,
    CommunicationsController,
  ],
  providers: [
    AppService,
    CompanyService,
    CompanyDetailsService,
    BusinessHoursService,
    PermissionsService,
    LabourCostService,
    CommunicationsService,
  ],
})
export class AppModule {}
