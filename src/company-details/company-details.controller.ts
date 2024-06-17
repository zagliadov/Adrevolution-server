import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompanyDetailsDto, PatchCompanyDetailsDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { CompanyDetailsService } from './company-details.service';

@ApiTags('Company Details')
@Controller('company-details')
@UseGuards(AuthGuard)
export class CompanyDetailsController {
  constructor(private companyDetailsService: CompanyDetailsService) {}

  /**
   * Create new company details
   * @param session - Session information of the user
   * @returns Created CompanyDetailsDto
   */
  @ApiOperation({ summary: 'Create new company details' })
  @ApiOkResponse({
    description: 'Successfully created company details.',
    type: CompanyDetailsDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Company details already exist for this user',
  })
  @Post()
  async createCompanyDetails(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDetailsDto> {
    return this.companyDetailsService.create(session.id);
  }

  /**
   * Get company details
   * @param session - Session information of the user
   * @returns CompanyDetailsDto
   */
  @ApiOperation({ summary: 'Get company details' })
  @ApiOkResponse({
    description: 'Successfully retrieved company details.',
    type: CompanyDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'Company details not found' })
  @Get('get')
  async getCompanyDetails(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDetailsDto> {
    return this.companyDetailsService.getCompanyDetails(session.id);
  }

  // /**
  //  * Update company details
  //  * @param body - Updated company details data
  //  * @param session - Session information of the user
  //  * @returns Updated CompanyDetailsDto
  //  */
  // @ApiOperation({ summary: 'Update company details' })
  // @ApiBody({ type: PatchCompanyDetailsDto })
  // @ApiOkResponse({
  //   description: 'Successfully updated company details.',
  //   type: CompanyDetailsDto,
  // })
  // @ApiResponse({ status: 400, description: 'Invalid input' })
  // @Patch('patch')
  // async patchCompanyDetails(
  //   @Body() body: PatchCompanyDetailsDto,
  //   @SessionInfo() session: GetSessionInfoDto,
  // ): Promise<CompanyDetailsDto> {
  //   return this.companyDetailsService.patchCompanyDetails(session.id, body);
  // }

  /**
   * Update company details
   * @param body - Updated company details data
   * @param session - Session information of the user
   * @returns Updated CompanyDetailsDto
   */
  @ApiOperation({ summary: 'Update company details' })
  @ApiBody({ type: PatchCompanyDetailsDto })
  @ApiOkResponse({
    description: 'Successfully updated company details.',
    type: CompanyDetailsDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch('patch')
  async patchCompanyDetails(
    @Body() body: PatchCompanyDetailsDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CompanyDetailsDto> {
    return this.companyDetailsService.patchCompanyDetails(session.id, body);
  }

  /**
   * Retrieves the industry field of a company by its ID.
   * @param {string} companyId - The unique identifier of the company.
   * @returns {Promise<string | null>} - The industry of the company or null if not set.
   * @throws {NotFoundException} - If the company or its details are not found.
   * @throws {InternalServerErrorException} - If there is a server error while fetching the industry.
   */
  @ApiOperation({ summary: 'Get industry by company ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved industry by company ID.',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({
    name: 'companyId',
    type: String,
    description: 'ID of the company',
  })
  @Get('industry/:companyId')
  async getIndustryByCompanyId(
    @Param('companyId') companyId: string,
  ): Promise<string | null> {
    return this.companyDetailsService.getIndustryByCompanyId(companyId);
  }
}
