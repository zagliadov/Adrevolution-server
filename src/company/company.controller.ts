import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyDto, PatchCompanyDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from 'src/users/dto';
import { ResourceDto } from 'src/resources/dto';
import { OrderDto } from 'src/order/dto';

@ApiTags('Company')
@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);

  constructor(private companyService: CompanyService) {}

  /**
   * Retrieve details of the current user's company
   * @param session - The session information of the current user
   * @returns The details of the current user's company
   */
  @ApiOperation({ summary: 'Get company details' })
  @ApiOkResponse({
    description: 'Successfully retrieved company details.',
    type: CompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @Get()
  async getCompany(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDto> {
    this.logger.log(`Handling GET request for company of user ${session.id}`);
    return this.companyService.getCompany(session.id);
  }

  /**
   * Create a new company for the current user
   * @param session - The session information of the current user
   * @returns The newly created company
   */
  @ApiOperation({ summary: 'Create a new company' })
  @ApiOkResponse({
    description: 'Successfully created company.',
    type: CompanyDto,
  })
  @Post()
  async createCompany(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDto> {
    this.logger.log(
      `Handling POST request to create company for user ${session.id}`,
    );
    return this.companyService.create(session.id);
  }

  /**
   * Retrieve all users of a specific company by company ID
   * @param companyId - The ID of the company
   * @returns A list of users for the specified company
   */
  @ApiOperation({ summary: 'Get users of company by company id' })
  @ApiOkResponse({
    description: 'Successfully retrieved users of company by company id.',
    type: [UserDto],
  })
  @ApiResponse({ status: 404, description: 'Company or users not found' })
  @Get(':companyId/users')
  async getUsersOfCompanyById(
    @Param('companyId') companyId: string,
  ): Promise<UserDto[]> {
    this.logger.log(`Handling GET request for users of company ${companyId}`);
    return this.companyService.getUsersOfCompanyById(companyId);
  }

  /**
   * Retrieve all users of the current user's company
   * @param session - The session information of the current user
   * @returns A list of users for the current user's company
   */
  @ApiOperation({ summary: 'Get users of company' })
  @ApiOkResponse({
    description: 'Successfully retrieved users of company.',
    type: [UserDto],
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @Get('users')
  async getUsersOfCompany(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserDto[]> {
    this.logger.log(`Handling GET request for users of company`);
    return this.companyService.getUsersOfCompany(session.id);
  }

  /**
   * Update details of the current user's company
   * @param body - The details to update
   * @param session - The session information of the current user
   * @returns The updated company details
   */
  @ApiOperation({ summary: 'Update company details' })
  @ApiBody({ type: PatchCompanyDto })
  @ApiOkResponse({
    description: 'Successfully patched company.',
    type: CompanyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch()
  async patchCompany(
    @Body() body: PatchCompanyDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDto> {
    this.logger.log(`Handling PATCH request for company of user ${session.id}`);
    return this.companyService.patchCompany(session.id, body);
  }

  /**
   * Add a user to a specific company
   * @param companyId - The ID of the company
   * @param userId - The ID of the user to add
   * @returns An object containing the name of the added user
   */
  @ApiOperation({ summary: 'Add user to company' })
  @ApiOkResponse({ description: 'Successfully added user to company.' })
  @Patch(':companyId/:userId')
  async addUserToCompany(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ): Promise<{ name: string }> {
    this.logger.log(
      `Handling PATCH request to add user ${userId} to company ${companyId}`,
    );
    return this.companyService.addUserToCompany(userId, companyId);
  }

  /**
   * Retrieve details of a specific company by company ID
   * @param companyId - The ID of the company
   * @returns The details of the specified company
   */
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved company by ID.',
    type: CompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @Get(':companyId')
  async getCompanyById(
    @Param('companyId') companyId: string,
  ): Promise<CompanyDto> {
    this.logger.log(`Handling GET request for company ${companyId}`);
    return this.companyService.getCompanyById(companyId);
  }

  /**
   * Retrieve all resources of the current user's company
   * @param session - The session information of the current user
   * @returns A list of resources for the current user's company
   */
  @ApiOperation({ summary: 'Get company resources for current user' })
  @ApiOkResponse({
    description: 'Successfully retrieved company resources.',
    type: [ResourceDto],
  })
  @ApiResponse({ status: 404, description: 'Resources not found' })
  @Get('resources')
  async getCompanyResources(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<ResourceDto[]> {
    this.logger.log(
      `Handling GET request for company resources of user ${session.id}`,
    );
    return this.companyService.getCompanyResources(session.id);
  }

  // /**
  //  * Retrieve all resources of a company by user ID
  //  * @param id - The ID of the user
  //  * @returns A list of resources for the specified user's company
  //  */
  // @ApiOperation({ summary: 'Get company resources by user id' })
  // @ApiOkResponse({
  //   description: 'Successfully retrieved company resources.',
  //   type: [ResourceDto],
  // })
  // @ApiResponse({ status: 404, description: 'Resources not found' })
  // @Get('resources/:id')
  // async getCompanyResourcesByUserId(
  //   @Param('id') id: string,
  // ): Promise<ResourceDto[]> {
  //   this.logger.log(`Handling GET request for company resources by user ${id}`);
  //   return this.companyService.getCompanyResources(id);
  // }

  /**
   * Retrieve all orders of the current user's company
   * @param session - The session information of the current user
   * @returns A list of orders for the current user's company
   */
  @ApiOperation({ summary: 'Get company orders for current user' })
  @ApiOkResponse({
    description: 'Successfully retrieved company orders.',
    type: [OrderDto],
  })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  @Get('orders')
  async getCompanyOrders(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<OrderDto[]> {
    this.logger.log(
      `Handling GET request for company orders of user ${session.id}`,
    );
    return this.companyService.getCompanyOrders(session.id);
  }
}

/*
  REST API
  /company
  GET /company - get all companies
  GET /company/:id - get company by id
  POST /company - create company
  PUT /company/:id - update company by id
  DELETE /company/:id - delete company by id

  GET /company/:id/users - get users from company
  POST /company/:id/users
  GET /company/:id/resources

  GET /resources
  GET /resources/:id
*/
