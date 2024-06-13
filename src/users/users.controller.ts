import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PatchUserDto, UserDto, UserWithoutPassword } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: UserDto,
  })
  getUserDetails(@SessionInfo() session: GetSessionInfoDto) {
    return this.usersService.getUserDetails(session.id);
  }

  @Get('get-user-by-id/:userId')
  @ApiOkResponse({
    type: UserDto,
  })
  getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Post('/create-new-user-without-password')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async createUserWithoutPassword(
    @Body() body: UserWithoutPassword,
  ): Promise<any> {
    await this.usersService.createUserWithoutPassword(body);
  }

  @Patch()
  @ApiOkResponse({
    type: PatchUserDto,
  })
  patchUser(
    @Body() body: PatchUserDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<{ id: string; email: string; hash: string; salt: string }> {
    return this.usersService.patchUser(body, session.id);
  }
}
