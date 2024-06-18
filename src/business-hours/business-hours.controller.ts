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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { BusinessHoursDto, PatchBusinessHoursDto } from './dto';
import { BusinessHoursService } from './business-hours.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Business hours')
@Controller('business-hours')
@UseGuards(AuthGuard)
export class BusinessHoursController {
  constructor(private businessHoursService: BusinessHoursService) {}

  /**
   * Create business hours
   * @param session - Session information of the user
   * @returns Created BusinessHoursDto
   */
  @ApiOperation({ summary: 'Create business hours' })
  @ApiBody({ type: BusinessHoursDto })
  @ApiOkResponse({
    description: 'Successfully created business hours',
    type: BusinessHoursDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  async createBusinessHours(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<BusinessHoursDto> {
    return this.businessHoursService.create(session.id);
  }

  /**
   * Get business hours
   * @param session - Session information of the user
   * @returns BusinessHoursDto
   */
  @ApiOperation({ summary: 'Get business hours' })
  @ApiOkResponse({
    description: 'Successfully retrieved business hours',
    type: BusinessHoursDto,
  })
  @ApiResponse({ status: 404, description: 'Business hours not found' })
  @Get()
  async getBusinessHours(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<BusinessHoursDto> {
    return this.businessHoursService.getBusinessHours(session.id);
  }

  /**
   * Get business hours by user ID
   * @param userId - ID of the user
   * @returns BusinessHoursDto
   */
  @ApiOperation({ summary: 'Get business hours by user ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved business hours',
    type: BusinessHoursDto,
  })
  @ApiResponse({ status: 404, description: 'Business hours not found' })
  @Get(':userId')
  async getBusinessHoursByUserId(
    @Param('userId') userId: string,
  ): Promise<BusinessHoursDto> {
    return this.businessHoursService.getBusinessHoursByUserId(userId);
  }

  /**
   * Update business hours
   * @param body - Updated business hours data
   * @param session - Session information of the user
   * @returns Updated BusinessHoursDto
   */
  @ApiOperation({ summary: 'Update business hours' })
  @ApiBody({ type: PatchBusinessHoursDto })
  @ApiOkResponse({
    description: 'Successfully updated business hours',
    type: BusinessHoursDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch()
  async patchBusinessHours(
    @Body() body: PatchBusinessHoursDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<BusinessHoursDto> {
    return this.businessHoursService.patchBusinessHours(session.id, body);
  }

  /**
   * Patch business hours by user ID
   * @param userId - ID of the user
   * @param body - Updated business hours data
   * @returns Updated BusinessHoursDto
   */
  @ApiOperation({ summary: 'Patch business hours by user ID' })
  @ApiBody({ type: PatchBusinessHoursDto })
  @ApiOkResponse({
    description: 'Successfully updated business hours',
    type: BusinessHoursDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch(':userId')
  async patchBusinessHoursById(
    @Param('userId') userId: string,
    @Body() body: PatchBusinessHoursDto,
  ): Promise<BusinessHoursDto> {
    return this.businessHoursService.patchBusinessHoursById(userId, body);
  }
}
