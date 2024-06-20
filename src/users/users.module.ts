import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbModule } from 'src/db/db.module';
import { UsersController } from './users.controller';
import { CompanyModule } from 'src/company/company.module';
import { BusinessHoursModule } from 'src/business-hours/business-hours.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PaymentTypeModule } from 'src/payment-type/payment-type.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserNotificationSettingsModule } from 'src/user-notification-settings/user-notification-settings.module';
import { UserPositionModule } from 'src/user-position-service/user-position.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => AuthModule),
    CompanyModule,
    BusinessHoursModule,
    UserPositionModule,
    PermissionsModule,
    PaymentTypeModule,
    UserNotificationSettingsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
