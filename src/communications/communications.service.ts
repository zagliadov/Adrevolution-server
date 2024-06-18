import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CommunicationDto, UpdateCommunicationDto } from './dto';

@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);
  constructor(private db: DbService) {}

  /**
   * Creates a new communication entry for a user.
   * @param userId - ID of the user
   * @returns The created communication entry
   */
  async create(userId: string): Promise<CommunicationDto> {
    this.logger.log(`Creating communication entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const communication = await this.db.communication.create({
        data: {
          userId: userId,
        },
      });

      this.logger.log(
        `Successfully created communication entry for user ${userId}`,
      );
      return {
        id: communication.id,
        userId: communication.userId,
        surveys: communication.surveys,
        errorMessages: communication.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create communication entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create communication. Please try again later.',
      );
    }
  }

  /**
   * Retrieves communication entry for a user.
   * @param userId - ID of the user
   * @returns The communication entry
   */
  async getCommunications(userId: string): Promise<CommunicationDto> {
    this.logger.log(`Retrieving communication entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const communication = await this.db.communication.findUnique({
        where: { userId },
      });

      if (!communication) {
        throw new NotFoundException(
          `Communication with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully retrieved communication entry for user ${userId}`,
      );
      return {
        id: communication.id,
        userId: communication.userId,
        surveys: communication.surveys,
        errorMessages: communication.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve communication entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to retrieve communication. Please try again later.',
      );
    }
  }

  /**
   * Retrieves communication entry for a user by their user ID.
   * @param userId - ID of the user
   * @returns The communication entry
   */
  async getCommunicationByUserId(userId: string): Promise<CommunicationDto> {
    this.logger.log(`Retrieving communication entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    try {
      const communication = await this.db.communication.findUnique({
        where: { userId },
      });

      if (!communication) {
        throw new NotFoundException(
          `Communication with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully retrieved communication entry for user ${userId}`,
      );
      return {
        id: communication.id,
        userId: communication.userId,
        surveys: communication.surveys,
        errorMessages: communication.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve communication entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to retrieve communication. Please try again later.',
      );
    }
  }

  /**
   * Updates communication entry for a user.
   * @param userId - ID of the user
   * @param dto - Data to update the communication entry
   * @returns The updated communication entry
   */
  async updateCommunications(
    userId: string,
    dto: UpdateCommunicationDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Updating communication entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    if (!dto || typeof dto !== 'object') {
      throw new InternalServerErrorException(
        'Update data must be a valid object.',
      );
    }

    try {
      const communication = await this.db.communication.update({
        where: { userId },
        data: {
          ...dto,
        },
      });

      if (!communication) {
        throw new NotFoundException(
          `Communication with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully updated communication entry for user ${userId}`,
      );
      return {
        id: communication.id,
        userId: communication.userId,
        surveys: communication.surveys,
        errorMessages: communication.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update communication entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update communication. Please try again later.',
      );
    }
  }

  /**
   * Updates communication entry for a user by their user ID.
   * @param userId - ID of the user
   * @param dto - Data to update the communication entry
   * @returns The updated communication entry
   */
  async updateCommunicationByUserId(
    userId: string,
    dto: UpdateCommunicationDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Updating communication entry for user ${userId}`);

    if (!userId) {
      throw new InternalServerErrorException('User ID must be provided.');
    }

    if (!dto || typeof dto !== 'object') {
      throw new InternalServerErrorException(
        'Update data must be a valid object.',
      );
    }

    try {
      const communication = await this.db.communication.update({
        where: { userId },
        data: {
          ...dto,
        },
      });

      if (!communication) {
        throw new NotFoundException(
          `Communication with userId ${userId} not found`,
        );
      }

      this.logger.log(
        `Successfully updated communication entry for user ${userId}`,
      );
      return {
        id: communication.id,
        userId: communication.userId,
        surveys: communication.surveys,
        errorMessages: communication.errorMessages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update communication entry for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update communication. Please try again later.',
      );
    }
  }
}
