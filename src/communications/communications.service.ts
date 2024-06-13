import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CommunicationDto, UpdateCommunicationDto } from './dto';

@Injectable()
export class CommunicationsService {
  constructor(private db: DbService) {}

  // ************************CREATE USER COMMUNICATIONS */
  async create(userId: string) {
    return this.db.communication.create({
      data: {
        userId: userId,
      },
    });
  }
  // ***************************GET USER COMMUNICATIONS */
  async getCommunications(userId: string): Promise<CommunicationDto> {
    const communication = await this.db.communication.findUnique({
      where: { userId },
    });

    if (!communication) {
      throw new NotFoundException(
        `Communication with userId ${userId} not found`,
      );
    }

    return {
      id: communication.id,
      userId: communication.userId,
      surveys: communication.surveys,
      errorMessages: communication.errorMessages,
    };
  }

  // ***************************PATCH USER COMMUNICATIONS */
  async updateCommunications(
    userId: string,
    dto: UpdateCommunicationDto,
  ): Promise<CommunicationDto> {
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

    return {
      id: communication.id,
      userId: communication.userId,
      surveys: communication.surveys,
      errorMessages: communication.errorMessages,
    };
  }
}
