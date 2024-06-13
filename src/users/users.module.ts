import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbModule } from 'src/db/db.module';
import { AccountModule } from 'src/account/account.module';
import { UsersController } from './users.controller';
import { CompanyModule } from 'src/company/company.module';
import { CompanyDetailsModule } from 'src/company-details/company-details.module';
import { BusinessHoursModule } from 'src/business-hours/business-hours.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { LabourCostModule } from 'src/labour-cost/labour-cost.module';
import { CommunicationsModule } from 'src/communications/communications.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => AuthModule),
    AccountModule,
    CompanyModule,
    CompanyDetailsModule,
    BusinessHoursModule,
    PermissionsModule,
    LabourCostModule,
    CommunicationsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
