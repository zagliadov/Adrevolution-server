import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { PermissionDto, PermissionLevel } from './dto';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class PermissionsService {
  constructor(
    private db: DbService,
    private companyService: CompanyService,
  ) {}

  async create(
    userId: string,
    companyId: string,
    level: PermissionLevel,
    isAdmin: boolean = false,
    isOwner: boolean = false,
  ) {
    return await this.db.permissions.create({
      data: {
        userId: userId,
        companyId: companyId,
        level: level,
        isAdmin: isAdmin,
        isOwner: isOwner,
      },
    });
  }

  // ***************************GET USER PERMISSION */
  async getPermission(userId: string): Promise<PermissionDto> {
    const company = await this.companyService.getCompany(userId);
    const permission = await this.db.permissions.findFirst({
      where: {
        userId: userId,
        companyId: company.id,
      },
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    const { isOwner, isAdmin, level } = permission;
    return {
      isOwner,
      isAdmin,
      level,
    };
  }
}
