import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { PaymentTypeService } from './payment-type.service';
import { PaymentTypeController } from './payment-type.controller';

@Module({
  imports: [DbModule],
  controllers: [PaymentTypeController],
  providers: [PaymentTypeService],
  exports: [PaymentTypeService],
})
export class PaymentTypeModule {}
