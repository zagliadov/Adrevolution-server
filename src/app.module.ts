import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyController } from './company/company.controller';
import { CompanyService } from './company/company.service';
import { CompanyModule } from './company/company.module';
import { BusinessHoursController } from './business-hours/business-hours.controller';
import { BusinessHoursService } from './business-hours/business-hours.service';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionsModule } from './permissions/permissions.module';
import { PaymentTypeController } from './payment-type/payment-type.controller';
import { PaymentTypeService } from './payment-type/payment-type.service';
import { UserNotificationSettingsController } from './user-notification-settings/user-notification-settings.controller';
import { UserNotificationSettingsService } from './user-notification-settings/user-notification-settings.service';
import { PaymentTypeModule } from './payment-type/payment-type.module';
import { UserNotificationSettingsModule } from './user-notification-settings/user-notification-settings.module';
import { ResourcesController } from './resources/resources.controller';
import { ResourcesService } from './resources/resources.service';
import { ResourcesModule } from './resources/resources.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { OrderCompaniesModule } from './order-companies/order-companies.module';
import { OrderResourcesModule } from './order-resources/order-resources.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    BusinessHoursModule,
    PermissionsModule,
    PaymentTypeModule,
    UserNotificationSettingsModule,
    ResourcesModule,
    OrderModule,
    OrderCompaniesModule,
    OrderResourcesModule,
  ],
  controllers: [
    AppController,
    CompanyController,
    BusinessHoursController,
    PermissionsController,
    PaymentTypeController,
    UserNotificationSettingsController,
    ResourcesController,
    OrderController,
  ],
  providers: [
    AppService,
    CompanyService,
    BusinessHoursService,
    PermissionsService,
    PaymentTypeService,
    UserNotificationSettingsService,
    ResourcesService,
    OrderService,
  ],
})
export class AppModule {}
