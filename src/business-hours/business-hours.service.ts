import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { BusinessHoursDto, PatchBusinessHoursDto } from './dto';
import { omitBy, isNil } from 'lodash';

@Injectable()
export class BusinessHoursService {
  private readonly logger = new Logger(BusinessHoursService.name);
  constructor(private db: DbService) {}

  /**
   * Create new business hours
   * @param userId - ID of the user
   * @returns Created or existing BusinessHoursDto
   */
  async create(userId: string): Promise<BusinessHoursDto> {
    try {
      this.logger.log(`Creating business hours for user ${userId}`);

      const existingBusinessHours = await this.db.businessHours.findUnique({
        where: { ownerId: userId },
      });

      if (existingBusinessHours) {
        this.logger.warn(`Business hours already exist for user ${userId}`);
        throw new ConflictException(
          'Business hours already exist for this user.',
        );
      }

      const businessHours = await this.db.businessHours.create({
        data: {
          ownerId: userId,
        },
      });

      this.logger.log(`Successfully created business hours for user ${userId}`);
      return businessHours;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create business hours for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create business hours. Please try again later.',
      );
    }
  }

  /**
   * Get business hours
   * @param userId - ID of the user
   * @returns BusinessHoursDto
   */
  async getBusinessHours(userId: string): Promise<BusinessHoursDto> {
    try {
      this.logger.log(`Fetching business hours for user ${userId}`);
      const businessHours = await this.db.businessHours.findUnique({
        where: { ownerId: userId },
      });

      if (!businessHours) {
        this.logger.warn(`Business hours not found for user ${userId}`);
        throw new NotFoundException(
          `Business hours not found for user ${userId}`,
        );
      }

      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
        businessHours;
      this.logger.log(`Successfully fetched business hours for user ${userId}`);
      return { monday, tuesday, wednesday, thursday, friday, saturday, sunday };
    } catch (error) {
      this.logger.error(
        `Failed to fetch business hours for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get business hours. Please try again later.',
      );
    }
  }

  /**
   * Update business hours
   * @param userId - ID of the user
   * @param updateData - Data to update
   * @returns Updated BusinessHoursDto
   */
  async patchBusinessHours(
    userId: string,
    updateData: PatchBusinessHoursDto,
  ): Promise<BusinessHoursDto> {
    try {
      this.logger.log(`Updating business hours for user ${userId}`);
      const data = omitBy(updateData, isNil);

      const updatedBusinessHours = await this.db.businessHours.update({
        where: {
          ownerId: userId,
        },
        data,
      });

      this.logger.log(`Successfully updated business hours for user ${userId}`);
      return updatedBusinessHours;
    } catch (error) {
      this.logger.error(
        `Failed to update business hours for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update business hours. Please try again later.',
      );
    }
  }
}
