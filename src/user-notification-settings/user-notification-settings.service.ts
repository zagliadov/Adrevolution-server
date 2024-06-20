import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  UpdateUserNotificationSettingsDto,
  UserNotificationSettingsDto,
} from './dto';

@Injectable()
export class UserNotificationSettingsService {
  private readonly logger = new Logger(UserNotificationSettingsService.name);
  constructor(private db: DbService) {}

  /**
   * Creates a new notifications entry for a user.
   * @param userId - ID of the user
   * @returns The created notifications entry
   */
  async create(userId: string): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Creating notifications entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const notifications = await this.db.userNotificationsSettings.create({
        data: {
          userId: userId,
        },
      });

      this.logger.log(
        `Successfully created notifications entry for user ${userId}`,
      );
      return {
        id: notifications.id,
        userId: notifications.userId,
        surveys: notifications.surveys,
        errorMessages: notifications.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create notifications entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create notifications. Please try again later.',
      );
    }
  }

  /**
   * Retrieves notifications entry for a user.
   * @param userId - ID of the user
   * @returns The notifications entry
   */
  async getUserNotificationSettings(
    userId: string,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Retrieving notifications entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const notifications = await this.db.userNotificationsSettings.findUnique({
        where: { userId },
      });

      if (!notifications) {
        throw new NotFoundException(
          `notifications with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully retrieved notifications entry for user ${userId}`,
      );
      return {
        id: notifications.id,
        userId: notifications.userId,
        surveys: notifications.surveys,
        errorMessages: notifications.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve notifications entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to retrieve notifications. Please try again later.',
      );
    }
  }

  /**
   * Retrieves notifications entry for a user by their user ID.
   * @param userId - ID of the user
   * @returns The notifications entry
   */
  async getUserNotificationSettingsByUserId(
    userId: string,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Retrieving notifications entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const notifications = await this.db.userNotificationsSettings.findUnique({
        where: { userId },
      });

      if (!notifications) {
        throw new NotFoundException(
          `notifications with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully retrieved notifications entry for user ${userId}`,
      );
      return {
        id: notifications.id,
        userId: notifications.userId,
        surveys: notifications.surveys,
        errorMessages: notifications.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve notifications entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to retrieve notifications. Please try again later.',
      );
    }
  }

  /**
   * Updates notifications entry for a user.
   * @param userId - ID of the user
   * @param dto - Data to update the notifications entry
   * @returns The updated notifications entry
   */
  async updateUserNotificationSettings(
    userId: string,
    dto: UpdateUserNotificationSettingsDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Updating notifications entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    if (!dto || typeof dto !== 'object') {
      throw new InternalServerErrorException(
        'Update data must be a valid object.',
      );
    }

    try {
      const notifications = await this.db.userNotificationsSettings.update({
        where: { userId },
        data: {
          ...dto,
        },
      });

      if (!notifications) {
        throw new NotFoundException(
          `notifications with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully updated notifications entry for user ${userId}`,
      );
      return {
        id: notifications.id,
        userId: notifications.userId,
        surveys: notifications.surveys,
        errorMessages: notifications.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update notifications entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update notifications. Please try again later.',
      );
    }
  }

  /**
   * Updates notifications entry for a user by their user ID.
   * @param userId - ID of the user
   * @param dto - Data to update the notifications entry
   * @returns The updated notifications entry
   */
  async updateUserNotificationSettingsByUserId(
    userId: string,
    dto: UpdateUserNotificationSettingsDto,
  ): Promise<UserNotificationSettingsDto> {
    this.logger.log(`Updating notifications entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    if (!dto || typeof dto !== 'object') {
      throw new InternalServerErrorException(
        'Update data must be a valid object.',
      );
    }

    try {
      const notifications = await this.db.userNotificationsSettings.update({
        where: { userId },
        data: {
          ...dto,
        },
      });

      if (!notifications) {
        throw new NotFoundException(
          `notifications with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully updated notifications entry for user ${userId}`,
      );
      return {
        id: notifications.id,
        userId: notifications.userId,
        surveys: notifications.surveys,
        errorMessages: notifications.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update notifications entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update notifications. Please try again later.',
      );
    }
  }
}
