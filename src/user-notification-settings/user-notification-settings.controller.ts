import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { UserNotificationSettingsService } from './user-notification-settings.service';
import {
  UpdateUserNotificationSettingsDto,
  UserNotificationSettingsDto,
} from './dto';

@ApiTags('User notification settings')
@Controller('user-notification-settings')
@UseGuards(AuthGuard)
export class UserNotificationSettingsController {
  private readonly logger = new Logger(UserNotificationSettingsController.name);
  constructor(
    private userNotificationSettingsService: UserNotificationSettingsService,
  ) {}

  /**
   * Creates a new notifications entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @returns The created notifications entry
   */
  @Post()
  @ApiOperation({ summary: 'Create user notifications' })
  @ApiOkResponse({
    type: UserNotificationSettingsService,
    description: 'Successfully created user notifications.',
  })
  createUserNotificationSettings(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Creating notifications for user ${session.id}`);
    return this.userNotificationSettingsService.create(session.id);
  }

  /**
   * Retrieves the notifications entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @returns The notifications entry
   */
  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiOkResponse({
    type: UserNotificationSettingsDto,
    description: 'Successfully retrieved user notifications.',
  })
  getUserNotificationSettings(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Retrieving notifications for user ${session.id}`);
    return this.userNotificationSettingsService.getUserNotificationSettings(
      session.id,
    );
  }

  /**
   * Retrieves the notifications entry for a user by their user ID.
   * @param userId - ID of the user
   * @returns The notifications entry
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiOkResponse({
    type: UserNotificationSettingsDto,
    description: 'Successfully retrieved notifications by user ID.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserNotificationSettingsByUserId(
    @Param('userId') userId: string,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Retrieving notifications for user ${userId}`);
    return this.userNotificationSettingsService.getUserNotificationSettingsByUserId(
      userId,
    );
  }

  /**
   * Updates the notifications entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @param dto - Data to update the notifications entry
   * @returns The updated notifications entry
   */
  @Patch()
  @ApiOperation({ summary: 'Update user notifications' })
  @ApiOkResponse({
    type: UserNotificationSettingsDto,
    description: 'Successfully updated user notifications.',
  })
  updateUserNotificationSettings(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() dto: UpdateUserNotificationSettingsDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Updating notifications for user ${session.id}`);
    return this.userNotificationSettingsService.updateUserNotificationSettings(
      session.id,
      dto,
    );
  }

  /**
   * Updates the notifications entry for a user by their user ID.
   * @param userId - ID of the user
   * @param dto - Data to update the notifications entry
   * @returns The updated notifications entry
   */
  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update notifications by user ID' })
  @ApiOkResponse({
    type: UserNotificationSettingsDto,
    description: 'Successfully updated notifications by user ID.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUserNotificationSettingsByUserId(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserNotificationSettingsDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Updating notifications for user ${userId}`);
    return this.userNotificationSettingsService.updateUserNotificationSettingsByUserId(
      userId,
      dto,
    );
  }
}
