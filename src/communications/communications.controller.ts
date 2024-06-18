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
import { CommunicationsService } from './communications.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommunicationDto, UpdateCommunicationDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('communications')
@Controller('communications')
@UseGuards(AuthGuard)
export class CommunicationsController {
  private readonly logger = new Logger(CommunicationsController.name);
  constructor(private communicationsService: CommunicationsService) {}

  /**
   * Creates a new communication entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @returns The created communication entry
   */
  @Post()
  @ApiOperation({ summary: 'Create user communications' })
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Successfully created user communications.',
  })
  createCommunications(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Creating communications for user ${session.id}`);
    return this.communicationsService.create(session.id);
  }

  /**
   * Retrieves the communication entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @returns The communication entry
   */
  @Get()
  @ApiOperation({ summary: 'Get user communications' })
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Successfully retrieved user communications.',
  })
  getCommunications(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Retrieving communications for user ${session.id}`);
    return this.communicationsService.getCommunications(session.id);
  }

  /**
   * Retrieves the communication entry for a user by their user ID.
   * @param userId - ID of the user
   * @returns The communication entry
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get communication by user ID' })
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Successfully retrieved communication by user ID.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getCommunicationByUserId(
    @Param('userId') userId: string,
  ): Promise<CommunicationDto> {
    this.logger.log(`Retrieving communication for user ${userId}`);
    return this.communicationsService.getCommunicationByUserId(userId);
  }

  /**
   * Updates the communication entry for the authenticated user.
   * @param session - The session info of the authenticated user
   * @param dto - Data to update the communication entry
   * @returns The updated communication entry
   */
  @Patch()
  @ApiOperation({ summary: 'Update user communications' })
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Successfully updated user communications.',
  })
  updateCommunications(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() dto: UpdateCommunicationDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Updating communications for user ${session.id}`);
    return this.communicationsService.updateCommunications(session.id, dto);
  }

  /**
   * Updates the communication entry for a user by their user ID.
   * @param userId - ID of the user
   * @param dto - Data to update the communication entry
   * @returns The updated communication entry
   */
  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update communication by user ID' })
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Successfully updated communication by user ID.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateCommunicationByUserId(
    @Param('userId') userId: string,
    @Body() dto: UpdateCommunicationDto,
  ): Promise<CommunicationDto> {
    this.logger.log(`Updating communication for user ${userId}`);
    return this.communicationsService.updateCommunicationByUserId(userId, dto);
  }
}
