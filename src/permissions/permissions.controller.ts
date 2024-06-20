import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from './dto';

@ApiTags('Permission')
@Controller('permissions')
export class PermissionsController {
  private readonly logger = new Logger(PermissionsController.name);

  constructor(private readonly permissionsService: PermissionsService) {}

  /**
   * Handle the creation of a new permission
   * @param dto - Data required to create a new permission
   * @returns The created permission
   */
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiOkResponse({
    description: 'Successfully created permission.',
    type: PermissionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreatePermissionDto })
  @Post()
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionDto> {
    this.logger.log('Handling POST request to create permission');
    return this.permissionsService.create(dto);
  }

  /**
   * Retrieve a specific permission by its ID
   * @param id - The ID of the permission
   * @returns The permission with the specified ID
   */
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved permission.',
    type: PermissionDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getPermission(@Param('id') id: string): Promise<PermissionDto> {
    this.logger.log(
      `Handling GET request to retrieve permission with ID ${id}`,
    );
    try {
      return await this.permissionsService.getPermission(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  /**
   * Update a specific permission by its ID
   * @param id - The ID of the permission to be updated
   * @param dto - Data to update the permission
   * @returns The updated permission
   */
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiOkResponse({
    description: 'Successfully updated permission.',
    type: PermissionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    this.logger.log(
      `Handling PATCH request to update permission with ID ${id}`,
    );
    try {
      return await this.permissionsService.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  /**
   * Delete a specific permission by its ID
   * @param id - The ID of the permission to be deleted
   */
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted permission.' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.log(
      `Handling DELETE request to remove permission with ID ${id}`,
    );
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
