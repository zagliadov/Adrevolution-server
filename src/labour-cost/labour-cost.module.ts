import { Module } from '@nestjs/common';
import { LabourCostController } from './labour-cost.controller';
import { DbModule } from 'src/db/db.module';
import { LabourCostService } from './labour-cost.service';

@Module({
  imports: [DbModule],
  controllers: [LabourCostController],
  providers: [LabourCostService],
  exports: [LabourCostService],
})
export class LabourCostModule {}
