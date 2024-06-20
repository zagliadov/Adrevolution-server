import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { UserPositionController } from './user-position.controller';
import { UserPositionService } from './user-position.service';

@Module({
  imports: [DbModule],
  controllers: [UserPositionController],
  providers: [UserPositionService],
  exports: [UserPositionService],
})
export class UserPositionModule {}
