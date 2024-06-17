import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AccountDto, PatchAccountDto } from './dto';
import { DbService } from 'src/db/db.service';
import { isEmpty, omitBy, isNil } from 'lodash';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private db: DbService) {}

  /**
   * Create new account
   * @param userId - ID of the user
   * @returns Created AccountDto
   */
  async create(userId: string): Promise<AccountDto> {
    try {
      this.logger.log(`Creating account for user ${userId}`);

      const existingAccount = await this.db.account.findUnique({
        where: { ownerId: userId },
      });

      if (existingAccount) {
        this.logger.warn(`Account already exists for user ${userId}`);
        throw new ConflictException('Account already exists for this user.');
      }

      const account = await this.db.account.create({
        data: {
          ownerId: userId,
          isBlockingEnabled: false,
        },
      });

      this.logger.log(`Successfully created account for user ${userId}`);
      return account;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create account for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create account. Please try again later.',
      );
    }
  }

  /**
   * Get account
   * @param userId - ID of the user
   * @returns AccountDto
   */
  async getAccount(userId: string): Promise<AccountDto> {
    try {
      this.logger.log(`Fetching account for user ${userId}`);
      const account = await this.db.account.findUnique({
        where: { ownerId: userId },
      });

      if (!account) {
        this.logger.warn(`Account not found for user ${userId}`);
        throw new NotFoundException('Account not found.');
      }

      this.logger.log(`Successfully fetched account for user ${userId}`);
      return account;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw new NotFoundException('Account not found.');
      }
      this.logger.error(
        `Failed to fetch account for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get account. Please try again later.',
      );
    }
  }

  /**
   * Update account
   * @param userId - ID of the user
   * @param patch - Data to update
   * @returns Updated AccountDto
   */
  async patchAccount(
    userId: string,
    patch: PatchAccountDto,
  ): Promise<AccountDto> {
    try {
      this.logger.log(`Updating account for user ${userId}`);
      if (isEmpty(patch)) {
        this.logger.warn(`No data provided for update by user ${userId}`);
        throw new BadRequestException('No data provided for update.');
      }

      const data = omitBy(patch, isNil);

      const updatedAccount = await this.db.account.update({
        where: {
          ownerId: userId,
        },
        data,
      });

      const ownerId = updatedAccount.ownerId;
      if (!ownerId) {
        this.logger.error(
          `Account update failed due to missing ownerId for user ${userId}`,
        );
        throw new InternalServerErrorException(
          'Account update failed due to missing ownerId.',
        );
      }

      this.logger.log(`Successfully updated account for user ${userId}`);
      return updatedAccount;
    } catch (error) {
      this.logger.error(
        `Failed to update account for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update account. Please try again later.',
      );
    }
  }
}
