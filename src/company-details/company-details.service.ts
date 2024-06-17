import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CompanyDetailsDto, PatchCompanyDetailsDto } from './dto';
import { omitBy, isNil } from 'lodash';
import { TransportationService } from 'src/transportation/transportation.service';

@Injectable()
export class CompanyDetailsService {
  private readonly logger = new Logger(CompanyDetailsService.name);
  constructor(
    private db: DbService,
    private transportationService: TransportationService,
  ) {}

  /**
   * Create new company details
   * @param userId - ID of the user
   * @returns Created or existing CompanyDetailsDto
   */
  async create(userId: string): Promise<CompanyDetailsDto> {
    try {
      const existingCompanyDetails = await this.db.companyDetails.findUnique({
        where: { ownerId: userId },
      });

      if (existingCompanyDetails) {
        return existingCompanyDetails;
      }

      const companyDetails = await this.db.companyDetails.create({
        data: {
          ownerId: userId,
        },
      });

      return companyDetails;
    } catch (error) {
      console.error(error, 'error');
      throw new InternalServerErrorException(
        'Unable to create company details. Please try again later.',
      );
    }
  }

  /**
   * Get company details
   * @param userId - ID of the user
   * @returns CompanyDetailsDto
   */
  async getCompanyDetails(userId: string): Promise<CompanyDetailsDto> {
    try {
      this.logger.log(`Fetching company details for user ${userId}`);
      const companyDetails = await this.db.companyDetails.findUnique({
        where: { ownerId: userId },
      });

      if (!companyDetails) {
        this.logger.warn(`Company details not found for user ${userId}`);
        throw new NotFoundException(
          `Company details not found for user ${userId}`,
        );
      }

      this.logger.log(
        `Successfully fetched company details for user ${userId}`,
      );
      return companyDetails;
    } catch (error) {
      this.logger.error(
        `Failed to fetch company details for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get company details. Please try again later.',
      );
    }
  }

  // /**
  //  * Update company details
  //  * @param userId - ID of the user
  //  * @param patch - Data to update
  //  * @returns Updated CompanyDetailsDto
  //  */
  // async patchCompanyDetails(
  //   userId: string,
  //   patch: PatchCompanyDetailsDto,
  // ): Promise<CompanyDetailsDto> {
  //   try {
  //     this.logger.log(`Updating company details for user ${userId}`);
  //     // const updateData = omitBy(patch, isNil);

  //     const updatedCompanyDetails = await this.db.companyDetails.update({
  //       where: { ownerId: userId },
  //       data: patch,
  //     });

  //     this.logger.log(
  //       `Successfully updated company details for user ${userId}`,
  //     );
  //     return updatedCompanyDetails;
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to update company details for user ${userId}`,
  //       error.stack,
  //     );
  //     throw new InternalServerErrorException(
  //       'Unable to update company details. Please try again later.',
  //     );
  //   }
  // }

  /**
   * Update company details
   * @param userId - ID of the user
   * @param patch - Data to update
   * @returns Updated CompanyDetailsDto
   * @throws InternalServerErrorException - If updating company details fails
   */
  async patchCompanyDetails(
    userId: string,
    patch: PatchCompanyDetailsDto,
  ): Promise<CompanyDetailsDto> {
    this.logger.log(`Updating company details for user ${userId}`);

    const updateData = omitBy(patch, isNil);
    console.log(updateData, 'updating company details');
    try {
      // Проверяем, существует ли компания
      const existingCompanyDetails = await this.db.companyDetails.findUnique({
        where: { ownerId: userId },
        include: { company: true },
      });

      if (!existingCompanyDetails) {
        this.logger.error(`Company details not found for user ${userId}`);
        throw new NotFoundException('Company details not found');
      }

      // Обновляем детали компании
      const updatedCompanyDetails = await this.db.companyDetails.update({
        where: { ownerId: userId },
        data: updateData,
        include: { company: true },
      });

      this.logger.log(
        `Successfully updated company details for user ${userId}`,
      );

      // Если компания транспортная, добавляем транспортные средства и грузы
      if (
        updateData.industry === 'Transportation' &&
        updatedCompanyDetails.company
      ) {
        await this.transportationService.createTransportAssets(
          updatedCompanyDetails.company.id,
        );
      }

      return updatedCompanyDetails;
    } catch (error) {
      this.logger.error(
        `Failed to update company details for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to update company details. Please try again later.',
      );
    }
  }

  /**
   * Retrieves the industry field of a company by its ID.
   * @param {string} companyId - The unique identifier of the company.
   * @returns {Promise<string>} - The industry of the company.
   * @throws {NotFoundException} - If the company or its details are not found.
   * @throws {InternalServerErrorException} - If there is a server error while fetching the industry.
   */
  async getIndustryByCompanyId(companyId: string): Promise<string | null> {
    this.logger.log(`Fetching industry for company with ID ${companyId}`);

    if (!companyId) {
      this.logger.error('companyId is undefined or null');
      throw new NotFoundException('Company ID must be provided');
    }

    try {
      // Find the company details by company ID
      const companyDetails = await this.db.company.findUnique({
        where: { id: companyId },
        select: {
          companyDetails: {
            select: {
              industry: true,
            },
          },
        },
      });

      if (!companyDetails || !companyDetails.companyDetails) {
        this.logger.error(
          `Company details not found for company with ID ${companyId}`,
        );
        throw new NotFoundException(
          `Company details not found for company with ID ${companyId}`,
        );
      }

      // Return the industry field
      return companyDetails.companyDetails.industry;
    } catch (error) {
      this.logger.error(
        `Failed to fetch industry for company with ID ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to get industry by company ID. Please try again later.',
      );
    }
  }
}
