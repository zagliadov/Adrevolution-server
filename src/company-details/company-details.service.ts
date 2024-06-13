import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CompanyDetailsDto } from './dto';

@Injectable()
export class CompanyDetailsService {
  constructor(private db: DbService) {}
  // ************************CREATE COMPANY DETAILS */
  async create(userId: string) {
    return this.db.companyDetails.create({
      data: {
        ownerId: userId,
      },
    });
  }

  // *************************PATCH COMPANY DETAILS */
  async patchCompanyDetails(userId: string, patch: CompanyDetailsDto) {
    return this.db.companyDetails.update({
      where: {
        ownerId: userId,
      },
      data: { ...patch },
    });
  }

  // ***************************GET COMPANY DETAILS */
  async getCompanyDetails(userId: string) {
    return this.db.companyDetails.findUniqueOrThrow({
      where: { ownerId: userId },
    });
  }
}
