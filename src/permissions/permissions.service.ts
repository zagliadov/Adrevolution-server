import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from './dto';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly db: DbService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * Create a new permission
   * @param dto - Data transfer object containing the permission details
   * @returns The created Permission object
   */
  async create(dto: CreatePermissionDto): Promise<PermissionDto> {
    try {
      const permission = await this.db.permissions.create({
        data: {
          userPositionId: dto.userPositionId,
          isAdmin: dto.isAdmin,
        },
      });

      return {
        id: permission.id,
        userPositionId: permission.userPositionId,
        isAdmin: permission.isAdmin,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating permission');
    }
  }

  /**
   * Get a permission by user ID
   * @param userId - ID of the user
   * @returns The Permission object
   */
  async getPermission(userId: string): Promise<PermissionDto> {
    const permission = await this.db.permissions.findFirst({
      where: {
        userPosition: {
          users: {
            some: { id: userId },
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return {
      id: permission.id,
      userPositionId: permission.userPositionId,
      isAdmin: permission.isAdmin,
    };
  }

  /**
   * Update a permission
   * @param id - ID of the permission to update
   * @param dto - Data transfer object containing the updated permission details
   * @returns The updated Permission object
   */
  async update(id: string, dto: UpdatePermissionDto): Promise<PermissionDto> {
    const existingPermission = await this.db.permissions.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }

    try {
      const updatedPermission = await this.db.permissions.update({
        where: { id },
        data: {
          isAdmin: dto.isAdmin ?? existingPermission.isAdmin,
        },
      });

      return {
        id: updatedPermission.id,
        userPositionId: updatedPermission.userPositionId,
        isAdmin: updatedPermission.isAdmin,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating permission');
    }
  }

  /**
   * Delete a permission by ID
   * @param id - ID of the permission to delete
   * @throws NotFoundException if the permission is not found
   */
  async delete(id: string): Promise<void> {
    const existingPermission = await this.db.permissions.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }

    try {
      await this.db.permissions.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting permission');
    }
  }
}
