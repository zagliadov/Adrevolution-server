import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateResourceDto,
  TransportCompanyType,
  UpdateResourceDto,
} from './dto';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  private readonly logger = new Logger(ResourcesController.name);

  constructor(private readonly resourcesService: ResourcesService) {}

  /**
   * Handle the creation of a new resource
   * @param data - Data required to create a new resource
   * @returns The created resource
   */
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiOkResponse({
    description: 'Successfully created resource.',
    type: CreateResourceDto,
  })
  @Post()
  async createResource(@Body() data: CreateResourceDto) {
    this.logger.log(`Handling POST request to create resource`);
    return this.resourcesService.createResource(data);
  }

  /**
   * Retrieve all resources for a specific company
   * @param companyId - The ID of the company
   * @returns A list of resources for the specified company
   */
  @ApiOperation({ summary: 'Get all resources by company id' })
  @ApiOkResponse({
    description: 'Successfully retrieved all resources.',
    type: [CreateResourceDto],
  })
  @Get()
  async findAllCompanyResources(@Query('companyId') companyId: string) {
    this.logger.log(
      `Handling GET request to retrieve all resources with companyId ${companyId}`,
    );
    return this.resourcesService.findAllCompanyResources(companyId);
  }

  /**
   * Retrieve a specific resource by its ID
   * @param id - The ID of the resource
   * @returns The resource with the specified ID
   */
  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved resource.',
    type: CreateResourceDto,
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @Get(':id')
  async findOneResource(@Param('id') id: string) {
    this.logger.log(`Handling GET request to retrieve resource with id ${id}`);
    return this.resourcesService.findOneResource(id);
  }

  /**
   * Update a specific resource by its ID
   * @param id - The ID of the resource to be updated
   * @param updateResourceDto - Data to update the resource
   * @returns The updated resource
   */
  @ApiOperation({ summary: 'Update a resource by ID' })
  @ApiBody({ type: UpdateResourceDto })
  @ApiOkResponse({
    description: 'Successfully updated resource.',
    type: CreateResourceDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch(':id')
  async updateResource(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    this.logger.log(`Handling PATCH request to update resource with id ${id}`);
    return this.resourcesService.updateResource(id, updateResourceDto);
  }

  /**
   * Delete a specific resource by its ID
   * @param id - The ID of the resource to be deleted
   */
  @ApiOperation({ summary: 'Delete a resource by ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted resource.' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @Delete(':id')
  async removeResource(@Param('id') id: string) {
    this.logger.log(`Handling DELETE request to remove resource with id ${id}`);
    return this.resourcesService.removeResource(id);
  }

  /**
   * Create default resources for a company based on its industry type
   * @param companyId - The ID of the company
   * @param industry - The industry type of the company
   */
  @ApiOperation({ summary: 'Create default resources for a company' })
  @ApiOkResponse({
    description: 'Successfully created default resources for company.',
  })
  @ApiQuery({ name: 'industry', enum: TransportCompanyType })
  @Post('default/:companyId')
  async createDefaultResourcesForCompany(
    @Param('companyId') companyId: string,
    @Query('industry') industry: TransportCompanyType,
  ) {
    this.logger.log(
      `Handling POST request to create default resources for company with ID ${companyId}`,
    );
    return this.resourcesService.createDefaultResourcesForCompany(
      companyId,
      industry,
    );
  }
}
