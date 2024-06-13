import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { BusinessHoursDto } from './dto';

@Injectable()
export class BusinessHoursService {
  constructor(private db: DbService) {}

  async create(userId: string) {
    return this.db.businessHours.create({
      data: {
        ownerId: userId,
      },
    });
  }

  async getBusinessHours(userId: string) {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      await this.db.businessHours.findUniqueOrThrow({
        where: { ownerId: userId },
      });
    return {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    };
  }

  async patchBusinessHours(userId: string, updateData: BusinessHoursDto) {
    return this.db.businessHours.update({
      where: {
        ownerId: userId,
      },
      data: { ...updateData },
    });
  }
}
