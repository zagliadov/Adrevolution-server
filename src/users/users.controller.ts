import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  PatchUserDto,
  UserDto,
  UserSecretDto,
  UserWithoutPassword,
  VerificationTokenDto,
} from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  /**
   * Find user by email
   * @param email - The email of the user to find
   * @returns The user with the specified email
   */
  @ApiOperation({ summary: 'Find user by email' })
  @ApiOkResponse({
    description: 'Successfully found user by email.',
    type: UserSecretDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'The email of the user',
  })
  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<UserSecretDto> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // TODO: remove hash and salt from response, ideally to have JWT token
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw error;
    }
  }

  /**
   * Get user details
   * @param session - The session information of the current user
   * @returns The details of the current user
   */
  @ApiOperation({ summary: 'Get user details' })
  @ApiOkResponse({
    description: 'Successfully retrieved user details.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get()
  async getUserDetails(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserDto> {
    this.logger.log(`Fetching details for user ${session.id}`);
    try {
      return this.usersService.getUserDetails(session.id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch details for user ${session.id}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param userId - The ID of the user to retrieve
   * @returns The user with the specified ID
   */
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved user by ID.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: String })
  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<UserDto> {
    this.logger.log(`Fetching user by ID ${userId}`);
    try {
      return this.usersService.getUserById(userId);
    } catch (error) {
      this.logger.error(`Failed to fetch user by ID ${userId}`, error.stack);
      throw error;
    }
  }

  /**
   * Create a new user without password
   * @param body - The user data without password
   */
  @ApiOperation({ summary: 'Create new user without password' })
  @ApiOkResponse({
    description: 'Successfully created new user without password.',
  })
  @ApiBody({ type: UserWithoutPassword })
  @Post('without-password')
  @HttpCode(HttpStatus.OK)
  async createUserWithoutPassword(@Body() body: UserWithoutPassword) {
    this.logger.log(`Creating new user without password`);
    try {
      return this.usersService.createUserWithoutPassword(body);
    } catch (error) {
      this.logger.error(
        'Failed to create new user without password',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update user details
   * @param body - The user data to update
   * @param session - The session information of the current user
   * @returns The updated user data
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    description: 'Successfully updated user.',
    type: UserDto,
  })
  @ApiBody({ type: PatchUserDto })
  @Patch()
  async patchUser(
    @Body() body: PatchUserDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<UserDto> {
    this.logger.log(`Updating user ${session.id}`);
    try {
      return this.usersService.patchUser(body, session.id);
    } catch (error) {
      this.logger.error(`Failed to update user ${session.id}`, error.stack);
      throw error;
    }
  }

  /**
   * Find verification token
   * @param token - The verification token to find
   * @returns The found verification token
   */
  @ApiOperation({ summary: 'Find verification token' })
  @ApiOkResponse({
    description: 'Successfully found verification token.',
    type: VerificationTokenDto,
  })
  @ApiResponse({ status: 404, description: 'Verification token not found' })
  @ApiParam({ name: 'token', type: String })
  @Get('verification/:token')
  @HttpCode(HttpStatus.OK)
  async findVerificationToken(
    @Param('token') token: string,
  ): Promise<VerificationTokenDto> {
    this.logger.log(`Finding verification token: ${token}`);
    try {
      const verificationToken =
        await this.usersService.findVerificationToken(token);
      if (!verificationToken) {
        throw new BadRequestException('Verification token not found');
      }
      return verificationToken;
    } catch (error) {
      this.logger.error(
        `Failed to find verification token: ${token}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update user password
   * @param userId - The ID of the user to update the password for
   * @param hash - The new password hash
   * @param salt - The new password salt
   */
  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({
    description: 'Successfully updated user password.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: String })
  @Patch('password/:userId')
  @HttpCode(HttpStatus.OK)
  async updateUserPassword(
    @Param('userId') userId: string,
    @Body('hash') hash: string,
    @Body('salt') salt: string,
  ): Promise<void> {
    this.logger.log(`Updating password for user ${userId}`);
    try {
      await this.usersService.updateUserPassword(userId, hash, salt);
    } catch (error) {
      this.logger.error(
        `Failed to update password for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param userId - The ID of the user to delete
   * @param session - The session information of the current user
   */
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiOkResponse({ description: 'Successfully deleted user.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: String })
  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<void> {
    this.logger.log(
      `Handling DELETE request for user ${userId} by user ${session.id}`,
    );
    try {
      await this.usersService.deleteUser(userId, session.id);
    } catch (error) {
      this.logger.error(`Failed to delete user ${userId}`, error.stack);
      throw error;
    }
  }
}
