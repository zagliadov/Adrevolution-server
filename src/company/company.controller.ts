import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CompanyDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  @ApiOkResponse({
    type: CompanyDto,
  })
  getCompany(@SessionInfo() session: GetSessionInfoDto) {
    return this.companyService.getCompany(session.id);
  }

  @Get('get-users-of-company')
  @ApiOkResponse({
    type: CompanyDto,
  })
  getUsersOfCompany(companyId: string) {
    return this.companyService.getUsersOfCompany(companyId);
  }

  @Patch()
  @ApiOkResponse({
    type: CompanyDto,
  })
  patchCompany(
    @Body() body: CompanyDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.companyService.patchCompany(session.id, body);
  }
}
