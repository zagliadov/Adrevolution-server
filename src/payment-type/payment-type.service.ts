import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CostUnit,
  CreatePaymentTypeDto,
  PaymentTypeDto,
  UpdatePaymentTypeDto,
} from './dto';
import { $Enums, PaymentType } from '@prisma/client';

@Injectable()
export class PaymentTypeService {
  constructor(private db: DbService) {}

  /**
   * Creates a new payment type entry.
   * @param dto Data transfer object containing the details of the payment type.
   * @returns The created PaymentType object.
   */
  async createPaymentType(dto: CreatePaymentTypeDto): Promise<PaymentType> {
    return this.db.paymentType.create({
      data: {
        labourCost: dto.labourCost,
        costUnit: dto.costUnit ?? CostUnit.PER_HOUR,
        userId: dto.userId,
      },
    });
  }

  /**
   * Updates an existing payment type entry for a given user.
   * @param userId The ID of the user whose payment type is to be updated.
   * @param dto Data transfer object containing the updated details.
   * @returns The updated PaymentType object.
   * @throws NotFoundException if the labour cost entry does not exist.
   */
  async updatePaymentType(
    userId: string,
    dto: UpdatePaymentTypeDto,
  ): Promise<PaymentType> {
    const existingRecord = await this.db.paymentType.findFirst({
      where: { userId },
    });

    if (!existingRecord) {
      throw new NotFoundException(
        `PaymentType with userId ${userId} not found`,
      );
    }

    return this.db.paymentType.update({
      where: { id: existingRecord.id },
      data: {
        labourCost: dto.labourCost,
        costUnit: dto.costUnit ?? existingRecord.costUnit,
      },
    });
  }

  /**
   * Retrieves a payment type entry for a given user.
   * @param userId The ID of the user whose payment type is to be retrieved.
   * @returns A PaymentTypeDto object containing the payment type details.
   * @throws NotFoundException if the payment type entry does not exist.
   */
  async getPaymentTypeByUserId(userId: string): Promise<PaymentTypeDto> {
    const paymentType = await this.db.paymentType.findFirst({
      where: { userId },
    });

    if (!paymentType) {
      throw new NotFoundException(
        `PaymentType with userId ${userId} not found`,
      );
    }

    const costUnit =
      paymentType.costUnit === $Enums.CostUnit.PER_HOUR
        ? CostUnit.PER_HOUR
        : CostUnit.PER_MONTH;

    return {
      id: paymentType.id,
      labourCost: paymentType.labourCost,
      costUnit,
      userId: paymentType.userId,
    };
  }

  /**
   * Deletes a payment type entry for a given user.
   * @param userId The ID of the user whose payment type is to be deleted.
   * @throws NotFoundException if the payment type entry does not exist.
   */
  async deletePaymentType(userId: string): Promise<void> {
    const existingRecord = await this.db.paymentType.findFirst({
      where: { userId },
    });

    if (!existingRecord) {
      throw new NotFoundException(
        `PaymentType with userId ${userId} not found`,
      );
    }

    await this.db.paymentType.delete({
      where: { id: existingRecord.id },
    });
  }
}
