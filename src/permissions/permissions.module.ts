import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [DbModule, CompanyModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {
  constructor(private readonly permissionsService: PermissionsService) {}
}
