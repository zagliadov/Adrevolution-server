import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PermissionDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  @ApiOkResponse({
    type: PermissionDto,
  })
  getPermission(@SessionInfo() session: GetSessionInfoDto) {
    return this.permissionsService.getPermission(session.id);
  }
}
