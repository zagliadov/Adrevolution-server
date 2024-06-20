import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  Delete,
  NotFoundException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreatePositionDto,
  UpdatePositionDto,
  AssignUserToPositionDto,
  PositionDto,
} from './dto';
import { UserPositionService } from './user-position.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('User Positions')
@Controller('user-position')
@UseGuards(AuthGuard)
export class UserPositionController {
  private readonly logger = new Logger(UserPositionController.name);

  constructor(private readonly userPositionService: UserPositionService) {}

  /**
   * Retrieve the user position of the current user
   * @param session - The session information of the current user
   * @returns The user position of the current user
   */
  @ApiOperation({ summary: 'Get user position' })
  @ApiOkResponse({
    description: 'Successfully retrieved user position.',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'User position not found' })
  @Get()
  async getUserPosition(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<PositionDto> {
    this.logger.log(`Handling GET request for company of user ${session.id}`);
    return this.userPositionService.getUserPosition(session.id);
  }

  /**
   * Create a new position
   * @param dto - Data required to create a new position
   * @returns The created position
   */
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({
    status: 201,
    description: 'Position created successfully',
    type: PositionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreatePositionDto })
  @Post()
  async create(@Body() dto: CreatePositionDto): Promise<PositionDto> {
    this.logger.log('Handling POST request to create a new position');
    return this.userPositionService.create(dto.name);
  }

  /**
   * Update an existing position by its ID
   * @param id - The ID of the position to update
   * @param dto - Data to update the position
   * @returns The updated position
   */
  @ApiOperation({ summary: 'Update a position by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePositionDto })
  @ApiResponse({
    status: 200,
    description: 'Position updated successfully',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
  ): Promise<PositionDto> {
    this.logger.log(`Handling PATCH request to update position with ID ${id}`);
    try {
      return await this.userPositionService.update(id, dto.name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Position with id ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Assign a user to a position
   * @param dto - Data required to assign a user to a position
   */
  @ApiOperation({ summary: 'Assign a user to a position' })
  @ApiResponse({
    status: 200,
    description: 'User assigned to position successfully',
  })
  @ApiResponse({ status: 404, description: 'User or position not found' })
  @ApiBody({ type: AssignUserToPositionDto })
  @Post('assign')
  async assignUserToPosition(
    @Body() dto: AssignUserToPositionDto,
  ): Promise<void> {
    this.logger.log('Handling POST request to assign user to position');
    try {
      await this.userPositionService.assignUserToPosition(
        dto.userId,
        dto.positionId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User or position not found');
      }
      throw error;
    }
  }

  /**
   * Retrieve a specific position by its ID
   * @param id - The ID of the position
   * @returns The position with the specified ID
   */
  @ApiOperation({ summary: 'Get position by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved position.',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getPositionByPositionId(@Param('id') id: string): Promise<PositionDto> {
    this.logger.log(`Handling GET request to retrieve position with ID ${id}`);
    const position = await this.userPositionService.getPositionByPositionId(id);
    if (!position) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }
    return position;
  }

  /**
   * Delete a specific position by its ID
   * @param id - The ID of the position to be deleted
   */
  @ApiOperation({ summary: 'Delete a position by ID' })
  @ApiResponse({
    status: 200,
    description: 'Position deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.log(`Handling DELETE request to remove position with ID ${id}`);
    try {
      await this.userPositionService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Position with id ${id} not found`);
      }
      throw error;
    }
  }
}
