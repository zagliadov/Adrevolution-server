import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CreateResourceDto,
  ResourceDto,
  TransportCompanyType,
  UpdateResourceDto,
} from './dto';
import { Prisma, Resource, ResourceType } from '@prisma/client';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private db: DbService) {}

  /**
   * Creates a new resource
   * @param data - Data required to create a new resource
   * @returns The created resource as a ResourceDto
   * @throws InternalServerErrorException if the resource could not be created
   */
  async createResource(data: CreateResourceDto): Promise<ResourceDto> {
    try {
      this.logger.log(`Creating resource with name ${data.name}`);

      const resource = await this.db.resource.create({
        data: {
          name: data.name,
          type: data.type,
          userId: data.userId,
          companyId: data.companyId,
          additionalProperties: data.additionalProperties as Prisma.JsonArray,
        },
      });

      this.logger.log(`Successfully created resource with id ${resource.id}`);
      return resource;
    } catch (error) {
      this.logger.error(
        `Failed to create resource with name ${data.name}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to create resource. Please try again later.',
      );
    }
  }

  /**
   * Retrieves all resources for a specific company
   * @param companyId - The ID of the company
   * @returns A list of resources for the specified company
   * @throws InternalServerErrorException if resources could not be retrieved
   */
  async findAllCompanyResources(companyId: string): Promise<Resource[]> {
    try {
      this.logger.log('Retrieving all resources');
      return await this.db.resource.findMany({
        where: { companyId },
      });
    } catch (error) {
      this.logger.error('Failed to retrieve resources', error.stack);
      throw new InternalServerErrorException(
        'Unable to retrieve resources. Please try again later.',
      );
    }
  }

  /**
   * Retrieves a specific resource by its ID
   * @param id - The ID of the resource
   * @returns The resource with the specified ID
   * @throws NotFoundException if the resource is not found
   * @throws InternalServerErrorException if the resource could not be retrieved
   */
  async findOneResource(id: string): Promise<Resource> {
    try {
      this.logger.log(`Retrieving resource with id ${id}`);
      const resource = await this.db.resource.findUnique({ where: { id } });

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      this.logger.log(`Successfully retrieved resource with id ${id}`);
      return resource;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve resource with id ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to retrieve resource. Please try again later.',
      );
    }
  }

  /**
   * Updates a specific resource by its ID
   * @param id - The ID of the resource to be updated
   * @param updateResourceDto - Data to update the resource
   * @returns The updated resource
   * @throws InternalServerErrorException if the resource could not be updated
   */
  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    try {
      this.logger.log(`Updating resource with id ${id}`);
      const resource = await this.db.resource.update({
        where: { id },
        data: updateResourceDto,
      });

      this.logger.log(`Successfully updated resource with id ${resource.id}`);
      return resource;
    } catch (error) {
      this.logger.error(`Failed to update resource with id ${id}`, error.stack);
      throw new InternalServerErrorException(
        'Unable to update resource. Please try again later.',
      );
    }
  }

  /**
   * Deletes a specific resource by its ID
   * @param id - The ID of the resource to be deleted
   * @throws InternalServerErrorException if the resource could not be deleted
   */
  async removeResource(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting resource with id ${id}`);
      await this.db.resource.delete({ where: { id } });

      this.logger.log(`Successfully deleted resource with id ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete resource with id ${id}`, error.stack);
      throw new InternalServerErrorException(
        'Unable to delete resource. Please try again later.',
      );
    }
  }

  /**
   * Creates default resources for a company based on its industry type
   * @param companyId - The ID of the company
   * @param industry - The industry type of the company
   * @throws InternalServerErrorException if the default resources could not be created
   */
  async createDefaultResourcesForCompany(
    companyId: string,
    industry: TransportCompanyType,
  ): Promise<void> {
    try {
      this.logger.log(
        `Creating default resources for company with ID ${companyId}`,
      );

      let defaultResources: CreateResourceDto[] = [];

      switch (industry) {
        case TransportCompanyType.FreightTransportCompany:
          defaultResources = [
            {
              name: 'Freight Truck',
              type: ResourceType.TRUCK,
              userId: null,
              companyId,
              additionalProperties: {
                registrationNumber: 'FR-1234',
                mark: 'FreightBrand',
                model: 'FreightModel',
                sizeInCubicMeters: '50',
                department: 'Logistics',
                drivingLicenseRequirement: 'C',
                fuelType: 'Diesel',
              },
            },
          ];
          break;
        case TransportCompanyType.PassengerTransportCompany:
          defaultResources = [
            {
              name: 'Passenger Car',
              type: ResourceType.CAR,
              userId: null,
              companyId,
              additionalProperties: {
                registrationNumber: 'PS-5678',
                mark: 'PassengerBrand',
                model: 'PassengerModel',
                sizeInCubicMeters: '5',
                department: 'Transport',
                drivingLicenseRequirement: 'B',
                fuelType: 'Petrol',
              },
            },
          ];
          break;
        case TransportCompanyType.LogisticsAndSupplyChainCompany:
          defaultResources = [
            {
              name: 'Logistics Van',
              type: ResourceType.VAN,
              userId: null,
              companyId,
              additionalProperties: {
                registrationNumber: 'LG-9012',
                mark: 'LogisticsBrand',
                model: 'LogisticsModel',
                sizeInCubicMeters: '30',
                department: 'Supply Chain',
                drivingLicenseRequirement: 'B',
                fuelType: 'Diesel',
              },
            },
          ];
          break;
        // Add other cases for other TransportCompanyType
        default:
          defaultResources = [
            {
              name: 'Default Truck',
              type: ResourceType.TRUCK,
              userId: null,
              companyId,
              additionalProperties: {
                registrationNumber: 'DF-3456',
                mark: 'DefaultBrand',
                model: 'DefaultModel',
                sizeInCubicMeters: '50',
                department: 'General',
                drivingLicenseRequirement: 'C',
                fuelType: 'Diesel',
              },
            },
            {
              name: 'Default Car',
              type: ResourceType.CAR,
              userId: null,
              companyId,
              additionalProperties: {
                registrationNumber: 'DF-7890',
                mark: 'DefaultBrand',
                model: 'DefaultModel',
                sizeInCubicMeters: '5',
                department: 'General',
                drivingLicenseRequirement: 'B',
                fuelType: 'Petrol',
              },
            },
          ];
          break;
      }

      for (const resourceDto of defaultResources) {
        await this.createResource(resourceDto);
      }

      this.logger.log(
        `Successfully created default resources for company with ID ${companyId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating default resources for company with ID ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error creating default resources for company',
      );
    }
  }
}
