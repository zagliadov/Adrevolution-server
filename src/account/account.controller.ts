import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountDto, PatchAccountDto } from './dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';

@ApiTags('Account')
@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  private readonly logger = new Logger(AccountController.name);
  constructor(private accountService: AccountService) {}

  @ApiOperation({ summary: 'Get account details' })
  @ApiOkResponse({
    description: 'Successfully retrieved account details.',
    type: AccountDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get()
  async getAccount(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<AccountDto> {
    this.logger.log(`Handling GET request for account of user ${session.id}`);
    return this.accountService.getAccount(session.id);
  }

  @ApiOperation({ summary: 'Update account details' })
  @ApiBody({ type: PatchAccountDto })
  @ApiOkResponse({
    description: 'Successfully updated account details.',
    type: AccountDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch()
  async patchAccount(
    @Body() body: PatchAccountDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<AccountDto> {
    this.logger.log(`Handling PATCH request for account of user ${session.id}`);
    return this.accountService.patchAccount(session.id, body);
  }
}
