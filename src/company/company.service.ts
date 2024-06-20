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
import { ResourcesService } from 'src/resources/resources.service';
import { ResourceDto, TransportCompanyType } from 'src/resources/dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private db: DbService,
    private resourceService: ResourcesService,
  ) {}

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

      await this.db.user.update({
        where: { id: userId },
        data: { ownedCompanyId: company.id },
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

      // Check if the industry is one of the transport company types and is not null
      if (
        updatedCompany.industry &&
        Object.values(TransportCompanyType).includes(
          updatedCompany.industry as TransportCompanyType,
        )
      ) {
        await this.resourceService.createDefaultResourcesForCompany(
          updatedCompany.id,
          updatedCompany.industry as TransportCompanyType,
        );
      }

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
  ): Promise<{ name: string }> {
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
      return { name: company.name ?? '' };
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

  /**
   * Get resources of company by company id
   * @param userId - ID of the user
   * @returns List of resources
   */
  async getCompanyResources(userId: string): Promise<ResourceDto[]> {
    const company = await this.getCompany(userId);

    if (!company || !company.id) {
      throw new Error('Company not found or company has no ID');
    }
    const resources = await this.resourceService.findAllCompanyResources(
      company.id,
    );

    return resources;
  }

  /**
   * Get orders of company by company id
   * @param userId - ID of the user
   * @returns List of orders
   */
  async getCompanyOrders(userId: string): Promise<ResourceDto[]> {
    const company = await this.getCompany(userId);

    if (!company || !company.id) {
      throw new Error('Company not found or company has no ID');
    }
    const resources = await this.resourceService.findAllCompanyResources(
      company.id,
    );

    return resources;
  }
}
