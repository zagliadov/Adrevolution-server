import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { PositionType } from '@prisma/client';
import { PositionDto } from './dto';

@Injectable()
export class UserPositionService {
  private readonly logger = new Logger(UserPositionService.name);

  constructor(private readonly db: DbService) {}

  /**
   * Create a new user position
   * @param name - Name of the position
   * @returns The created position
   */
  async create(name: PositionType) {
    try {
      return await this.db.userPosition.create({
        data: { name },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating user position');
    }
  }

  /**
   * Get user position by user ID
   * @param userId - ID of the user
   * @returns PositionDto - User's position information
   */
  async getUserPosition(
    userId: string,
  ): Promise<PositionDto & { isAdmin: boolean }> {
    this.logger.log(`Fetching position for user ${userId}`);

    const userPosition = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        userPosition: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                isAdmin: true,
              },
            },
          },
        },
      },
    });

    if (!userPosition || !userPosition.userPosition) {
      this.logger.warn(`User position not found for user ${userId}`);
      throw new NotFoundException('User position not found');
    }

    const { id, name, permissions } = userPosition.userPosition;
    return {
      id,
      name,
      isAdmin: permissions?.some((permission) => permission.isAdmin) ?? false,
    };
  }

  /**
   * Update an existing user position
   * @param id - ID of the position to update
   * @param name - New name of the position
   * @returns The updated position
   * @throws NotFoundException if the position is not found
   */
  async update(id: string, name?: PositionType) {
    const existingPosition = await this.db.userPosition.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    try {
      return await this.db.userPosition.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating user position');
    }
  }

  /**
   * Assign a user to a position
   * @param userId - ID of the user
   * @param positionId - ID of the position
   * @throws NotFoundException if the user or position is not found
   */
  async assignUserToPosition(userId: string, positionId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const position = await this.db.userPosition.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      throw new NotFoundException(`Position with id ${positionId} not found`);
    }

    try {
      await this.db.user.update({
        where: { id: userId },
        data: { positionId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error assigning user to position',
      );
    }
  }

  /** ???
   * Retrieve a position by its ID
   * @param id - ID of the position to retrieve
   * @returns The retrieved position
   * @throws NotFoundException if the position is not found
   */
  async getPositionByPositionId(id: string) {
    const position = await this.db.userPosition.findUnique({
      where: { id },
    });

    if (!position) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    return position;
  }

  /**
   * Delete a position by its ID
   * @param id - ID of the position to delete
   * @throws NotFoundException if the position is not found
   */
  async delete(id: string) {
    const existingPosition = await this.db.userPosition.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    try {
      await this.db.userPosition.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user position');
    }
  }
}
