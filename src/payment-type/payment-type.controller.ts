import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PaymentTypeService } from './payment-type.service';
import {
  CreatePaymentTypeDto,
  PaymentTypeDto,
  UpdatePaymentTypeDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';

@ApiTags('Payment type')
@Controller('payment-type')
export class PaymentTypeController {
  constructor(private paymentTypeService: PaymentTypeService) {}

  @Post()
  @ApiCreatedResponse({ type: PaymentTypeDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() dto: CreatePaymentTypeDto): Promise<PaymentType> {
    return this.paymentTypeService.createPaymentType(dto);
  }

  @Patch(':userId')
  @ApiOkResponse({ type: PaymentTypeDto })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('userId') userId: string,
    @Body() dto: UpdatePaymentTypeDto,
  ): Promise<PaymentType> {
    return this.paymentTypeService.updatePaymentType(userId, dto);
  }

  @Get(':userId')
  @ApiOkResponse({ type: PaymentTypeDto })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  findByUserId(@Param('userId') userId: string): Promise<PaymentTypeDto> {
    return this.paymentTypeService.getPaymentTypeByUserId(userId);
  }

  @Delete(':userId')
  @ApiOkResponse({ description: 'Payment Type deleted successfully' })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  async delete(@Param('userId') userId: string): Promise<void> {
    await this.paymentTypeService.deletePaymentType(userId);
  }
}
