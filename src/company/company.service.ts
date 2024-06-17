import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CompanyDto, PatchCompanyDto } from './dto';
import { omitBy, isNil } from 'lodash';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(private db: DbService) {}

  /**
   * Create new company
   * @param userId - ID of the user
   * @returns Created CompanyDto
   */
  async create(userId: string): Promise<CompanyDto> {
    try {
      this.logger.log(`Creating company for user ${userId}`);

      const existingCompany = await this.db.company.findUnique({
        where: { ownerId: userId },
      });

      if (existingCompany) {
        this.logger.warn(`Company already exists for user ${userId}`);
        throw new ConflictException('Company already exists for this user.');
      }

      const company = await this.db.company.create({
        data: { ownerId: userId },
      });

      this.logger.log(`Successfully created company for user ${userId}`);
      return company;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create company for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create company. Please try again later.',
      );
    }
  }

  async getCompany(userId: string): Promise<CompanyDto> {
    try {
      this.logger.log(`Fetching company for user ${userId}`);

      let company = await this.db.company.findFirst({
        where: { ownerId: userId },
      });

      if (!company) {
        this.logger.log(
          `User ${userId} is not the owner, checking user membership...`,
        );
        company = await this.db.company.findFirst({
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        });
      }

      if (!company) {
        this.logger.warn(`No company found for user ${userId}`);
        throw new InternalServerErrorException(
          'No company found for this user.',
        );
      }

      this.logger.log(`Successfully fetched company for user ${userId}`);
      return company;
    } catch (error) {
      this.logger.error(
        `Failed to fetch company for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get company. Please try again later.',
      );
    }
  }

  /**
   * Update company
   * @param userId - ID of the user
   * @param updateData - Data to update
   * @returns Updated CompanyDto
   */
  async patchCompany(
    userId: string,
    updateData: PatchCompanyDto,
  ): Promise<CompanyDto> {
    try {
      this.logger.log(`Updating company for user ${userId}`);
      const data = omitBy(updateData, isNil);

      const updatedCompany = await this.db.company.update({
        where: { ownerId: userId },
        data,
      });

      this.logger.log(`Successfully updated company for user ${userId}`);
      return updatedCompany;
    } catch (error) {
      this.logger.error(
        `Failed to update company for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update company. Please try again later.',
      );
    }
  }

  /**
   * Add user to company
   * @param userId - ID of the user
   * @param companyId - ID of the company
   * @returns Object containing the company name
   */
  async addUserToCompany(
    userId: string,
    companyId: string,
  ): Promise<{ companyName: string }> {
    try {
      this.logger.log(`Adding user ${userId} to company ${companyId}`);

      const company = await this.db.company.update({
        where: { id: companyId },
        data: {
          users: {
            connect: { id: userId },
          },
        },
      });

      this.logger.log(
        `Successfully added user ${userId} to company ${companyId}`,
      );
      return { companyName: company.companyName ?? '' };
    } catch (error) {
      this.logger.error(
        `Failed to add user ${userId} to company ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to add user to company. Please try again later.',
      );
    }
  }

  /**
   * Connect company details to company
   * @param companyDetailsId - ID of the company details
   * @param companyId - ID of the company
   */
  async connectCompanyDetailsToCompany(
    companyDetailsId: string,
    companyId: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `Connecting company details ${companyDetailsId} to company ${companyId}`,
      );

      await this.db.company.update({
        where: { id: companyId },
        data: {
          companyDetails: {
            connect: { id: companyDetailsId },
          },
        },
      });

      this.logger.log(
        `Successfully connected company details ${companyDetailsId} to company ${companyId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to connect company details ${companyDetailsId} to company ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to connect company details. Please try again later.',
      );
    }
  }

  /**
   * Get users of company
   * @param userId - ID of the user
   * @returns List of users
   */
  async getUsersOfCompany(userId: string) {
    try {
      const company = await this.getCompany(userId);
      const companyId = company.id;
      const users = await this.db.user.findMany({
        where: { companyId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          lastLogin: true,
          streetAddress: true,
          city: true,
          province: true,
          postalCode: true,
          country: true,
          phoneNumber: true,
        },
      });

      this.logger.log(`Successfully fetched users of company ${companyId}`);
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users of company`, error.stack);
      throw new InternalServerErrorException(
        'Unable to get users of company. Please try again later.',
      );
    }
  }

  /**
   * Get users of company by company id
   * @param companyId - ID of the company
   * @returns List of users
   */
  async getUsersOfCompanyById(companyId: string) {
    try {
      this.logger.log(`Fetching users of company ${companyId}`);

      const users = await this.db.user.findMany({
        where: { companyId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          lastLogin: true,
          streetAddress: true,
          city: true,
          province: true,
          postalCode: true,
          country: true,
          phoneNumber: true,
        },
      });

      this.logger.log(`Successfully fetched users of company ${companyId}`);
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to fetch users of company ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get users of company. Please try again later.',
      );
    }
  }

  /**
   * Retrieves a company by its ID.
   * @param {string} companyId - The unique identifier of the company.
   * @returns {Promise<Company>} - The company object if found.
   * @throws {NotFoundException} - If the company ID is invalid or the company is not found.
   * @throws {InternalServerErrorException} - If there is a server error while fetching the company.
   */
  async getCompanyById(companyId: string) {
    this.logger.log(`Fetching company by ${companyId}`);

    // Validate the companyId
    if (!companyId) {
      this.logger.error('companyId is undefined or null');
      throw new NotFoundException('Company ID must be provided');
    }

    try {
      // Attempt to find the company by ID
      const company = await this.db.company.findUnique({
        where: {
          id: companyId,
        },
      });

      // Handle case where company is not found
      if (!company) {
        this.logger.error(`Company with id ${companyId} not found`);
        throw new NotFoundException(`Company with id ${companyId} not found`);
      }

      // Return the found company
      return company;
    } catch (error) {
      // Log and throw internal server error for any other issues
      this.logger.error(`Failed to fetch company by ${companyId}`, error.stack);
      throw new InternalServerErrorException(
        'Unable to get company by ID. Please try again later.',
      );
    }
  }
}
