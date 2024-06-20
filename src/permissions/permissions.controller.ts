import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from './dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: PermissionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionDto> {
    return this.permissionsService.create(dto);
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Permission retrieved successfully',
    type: PermissionDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async getPermission(@Param('userId') userId: string): Promise<PermissionDto> {
    try {
      return await this.permissionsService.getPermission(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: PermissionDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    try {
      return await this.permissionsService.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.permissionsService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }
}
