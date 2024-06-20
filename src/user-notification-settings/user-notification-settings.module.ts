import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { UserNotificationSettingsController } from './user-notification-settings.controller';
import { UserNotificationSettingsService } from './user-notification-settings.service';

@Module({
  imports: [DbModule],
  controllers: [UserNotificationSettingsController],
  providers: [UserNotificationSettingsService],
  exports: [UserNotificationSettingsService],
})
export class UserNotificationSettingsModule {
  constructor(
    private readonly userNotificationSettingsService: UserNotificationSettingsService,
  ) {}
}
