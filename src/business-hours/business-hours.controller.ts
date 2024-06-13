import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { BusinessHoursDto } from './dto';
import { BusinessHoursService } from './business-hours.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('business-hours')
@UseGuards(AuthGuard)
export class BusinessHoursController {
  constructor(private businessHoursService: BusinessHoursService) {}
  @Get()
  @ApiOkResponse({
    type: BusinessHoursDto,
  })
  getBusinessHours(@SessionInfo() session: GetSessionInfoDto) {
    return this.businessHoursService.getBusinessHours(session.id);
  }

  @Patch()
  @ApiOkResponse({
    type: BusinessHoursDto,
  })
  patchBusinessHours(
    @Body() body: BusinessHoursDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.businessHoursService.patchBusinessHours(session.id, body);
  }
}
