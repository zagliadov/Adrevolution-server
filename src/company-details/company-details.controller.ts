import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompanyDetailsDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { CompanyDetailsService } from './company-details.service';

@Controller('company-details')
@UseGuards(AuthGuard)
export class CompanyDetailsController {
  constructor(private companyDetailsService: CompanyDetailsService) {}

  @Get()
  @ApiOkResponse({
    type: CompanyDetailsDto,
  })
  getCompanyDetails(@SessionInfo() session: GetSessionInfoDto) {
    return this.companyDetailsService.getCompanyDetails(session.id);
  }

  @Patch()
  @ApiOkResponse({
    type: CompanyDetailsDto,
  })
  patchCompanyDetails(
    @Body() body: CompanyDetailsDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.companyDetailsService.patchCompanyDetails(session.id, body);
  }
}
