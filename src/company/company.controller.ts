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

@ApiTags('Company')
@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);
  constructor(private companyService: CompanyService) {}

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

  @ApiOperation({ summary: 'Get users of company by company id' })
  @ApiOkResponse({
    description: 'Successfully retrieved users of company by company id.',
    type: [UserDto],
  })
  @ApiResponse({ status: 404, description: 'Company or users not found' })
  @Get('get-users-of-company/:companyId')
  async getUsersOfCompanyById(
    @Param('companyId') companyId: string,
  ): Promise<UserDto[]> {
    this.logger.log(`Handling GET request for users of company ${companyId}`);
    return this.companyService.getUsersOfCompanyById(companyId);
  }

  @ApiOperation({ summary: 'Get users of company' })
  @ApiOkResponse({
    description: 'Successfully retrieved users of company.',
    type: [UserDto],
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @Get('get-users-of-company')
  async getUsersOfCompany(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserDto[]> {
    this.logger.log(`Handling GET request for users of company`);
    return this.companyService.getUsersOfCompany(session.id);
  }

  @ApiOperation({ summary: 'Update company details' })
  @ApiBody({ type: PatchCompanyDto })
  @ApiOkResponse({
    description: 'Successfully patched company.',
    type: CompanyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch('patch-company')
  async patchCompany(
    @Body() body: PatchCompanyDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDto> {
    this.logger.log(`Handling PATCH request for company of user ${session.id}`);
    return this.companyService.patchCompany(session.id, body);
  }

  @ApiOperation({ summary: 'Add user to company' })
  @ApiOkResponse({ description: 'Successfully added user to company.' })
  @Patch('add-user-to-company/:companyId/:userId')
  async addUserToCompany(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ): Promise<{ companyName: string }> {
    this.logger.log(
      `Handling PATCH request to add user ${userId} to company ${companyId}`,
    );
    return this.companyService.addUserToCompany(userId, companyId);
  }

  @ApiOperation({ summary: 'Connect company details to company' })
  @ApiOkResponse({
    description: 'Successfully connected company details to company.',
  })
  @Patch('connect-company-details/:companyId/:companyDetailsId')
  async connectCompanyDetailsToCompany(
    @Param('companyId') companyId: string,
    @Param('companyDetailsId') companyDetailsId: string,
  ): Promise<void> {
    this.logger.log(
      `Handling PATCH request to connect company details ${companyDetailsId} to company ${companyId}`,
    );
    return this.companyService.connectCompanyDetailsToCompany(
      companyDetailsId,
      companyId,
    );
  }

  @ApiOperation({ summary: 'Get company by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved company by ID.',
  })
  @ApiResponse({ status: 404, description: 'Company or users not found' })
  @Get('get-company-by-id/:companyId')
  async getCompanyById(@Param('companyId') companyId: string) {
    this.logger.log(`Handling GET request for users of company ${companyId}`);
    return this.companyService.getCompanyById(companyId);
  }
}
