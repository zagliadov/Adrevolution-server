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

  @ApiOperation({ summary: 'Get user position' })
  @ApiOkResponse({
    description: 'Successfully retrieved user position.',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'user position not found' })
  @Get()
  async getUserPosition(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<PositionDto> {
    this.logger.log(`Handling GET request for company of user ${session.id}`);
    return this.userPositionService.getUserPosition(session.id);
  }

  @Post()
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({
    status: 201,
    description: 'Position created successfully',
    type: PositionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreatePositionDto): Promise<PositionDto> {
    const position = await this.userPositionService.create(dto.name);
    return position;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePositionDto })
  @ApiResponse({
    status: 200,
    description: 'Position updated successfully',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
  ): Promise<PositionDto> {
    try {
      const position = await this.userPositionService.update(id, dto.name);
      return position;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Position with id ${id} not found`);
      }
      throw error;
    }
  }

  @Post('assign')
  @ApiBody({ type: AssignUserToPositionDto })
  @ApiResponse({
    status: 200,
    description: 'User assigned to position successfully',
  })
  @ApiResponse({ status: 404, description: 'User or position not found' })
  async assignUserToPosition(
    @Body() dto: AssignUserToPositionDto,
  ): Promise<void> {
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

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Position retrieved successfully',
    type: PositionDto,
  })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async getPositionByPositionId(@Param('id') id: string): Promise<PositionDto> {
    const position = await this.userPositionService.getPositionByPositionId(id);
    if (!position) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }
    return position;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Position deleted successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async delete(@Param('id') id: string): Promise<void> {
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
