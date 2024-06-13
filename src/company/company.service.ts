import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(private db: DbService) {}

  // ************************CREATE COMPANY */
  async create(userId: string) {
    return this.db.company.create({
      data: {
        ownerId: userId,
      },
    });
  }

  // *************************PATCH COMPANY */
  async patchCompany(userId: string, patch: CompanyDto) {
    return this.db.company.update({
      where: {
        ownerId: userId,
      },
      data: { ...patch },
    });
  }

  // ************************* ADD USER TO COMPANY */
  async addUserToCompany(userId: string, companyId: string) {
    const company = await this.db.company.update({
      where: { id: companyId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
    return {
      companyName: company.companyName,
    };
  }

  // ***************************GET COMPANY */
  async getCompany(userId: string) {
    return this.db.company.findUniqueOrThrow({ where: { ownerId: userId } });
  }

  // ***************************GET USERS OF COMPANY */
  async getUsersOfCompany(companyId: string) {
    return this.db.user.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        lastLogin: true,
      },
    });
  }
}
