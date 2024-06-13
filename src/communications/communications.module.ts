import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';

@Module({
  imports: [DbModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {
  constructor(private readonly communicationService: CommunicationsService) {}
}
