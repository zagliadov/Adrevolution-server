import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountDto, PatchAccountDto } from './dto';
import { DbService } from 'src/db/db.service';
import { isEmpty, get } from 'lodash';

@Injectable()
export class AccountService {
  constructor(private db: DbService) {}

  // ************************CREATE ACCOUNT */
  async create(userId: string): Promise<AccountDto> {
    try {
      const account = await this.db.account.create({
        data: {
          ownerId: userId,
          isBlockingEnabled: false,
        },
      });
      return account;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create account. Please try again later.',
      );
    }
  }

  // ***************************GET ACCOUNT */
  async getAccount(userId: string): Promise<AccountDto> {
    try {
      const account = await this.db.account.findUniqueOrThrow({
        where: { ownerId: userId },
      });

      return account;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw new NotFoundException('Account not found.');
      }
      throw new InternalServerErrorException(
        'Unable to get account. Please try again later.',
      );
    }
  }

  // *************************PATCH ACCOUNT */
  async patchAccount(userId: string, patch: PatchAccountDto) {
    try {
      if (isEmpty(patch)) {
        throw new BadRequestException('No data provided for update.');
      }
      const updatedAccount = await this.db.account.update({
        where: {
          ownerId: userId,
        },
        data: { ...patch },
      });
      const ownerId = get(updatedAccount, 'ownerId');
      if (!ownerId) {
        throw new InternalServerErrorException(
          'Account update failed due to missing ownerId.',
        );
      }
      return updatedAccount;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to update account. Please try again later.',
      );
    }
  }
}
