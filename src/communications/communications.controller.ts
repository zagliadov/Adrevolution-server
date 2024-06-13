import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { CommunicationDto, UpdateCommunicationDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@Controller('communications')
@UseGuards(AuthGuard)
export class CommunicationsController {
  constructor(private communicationsService: CommunicationsService) {}
  @Get()
  @ApiOkResponse({
    type: CommunicationDto,
  })
  getCommunications(@SessionInfo() session: GetSessionInfoDto) {
    return this.communicationsService.getCommunications(session.id);
  }

  @Patch()
  @ApiOkResponse({
    type: CommunicationDto,
  })
  updateCommunications(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() dto: UpdateCommunicationDto,
  ) {
    return this.communicationsService.updateCommunications(session.id, dto);
  }
}
