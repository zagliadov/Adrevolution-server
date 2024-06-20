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
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
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

  @ApiOperation({ summary: 'Find user by email' })
  @ApiOkResponse({
    description: 'Successfully found user by email.',
    type: UserSecretDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('find-by-email')
  async findByEmail(@Query('email') email: string): Promise<UserSecretDto> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      //TODO: remove hash and salt from response, ideally to have JWT token
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw error;
    }
  }

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

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved user by ID.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('get-user-by-id/:userId')
  async getUserById(@Param('userId') userId: string): Promise<UserDto> {
    this.logger.log(`Fetching user by ID ${userId}`);
    try {
      return this.usersService.getUserById(userId);
    } catch (error) {
      this.logger.error(`Failed to fetch user by ID ${userId}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create new user without password' })
  @ApiOkResponse({
    description: 'Successfully created new user without password.',
  })
  @Post('/create-new-user-without-password')
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

  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    description: 'Successfully updated user.',
    type: PatchUserDto,
  })
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

  @ApiOperation({ summary: 'Find verification token' })
  @ApiOkResponse({
    description: 'Successfully found verification token.',
    type: VerificationTokenDto,
  })
  @ApiResponse({ status: 404, description: 'Verification token not found' })
  @Get('find-verification-token/:token')
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

  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({
    description: 'Successfully updated user password.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch('update-password/:userId')
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

  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    this.logger.log(
      `Handling DELETE request for user ${userId} by user ${session.id}`,
    );
    return this.usersService.deleteUser(userId, session.id);
  }
}
