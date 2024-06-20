import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Logger,
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
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';

@ApiTags('Payment type')
@Controller('payment-type')
export class PaymentTypeController {
  private readonly logger = new Logger(PaymentTypeController.name);

  constructor(private paymentTypeService: PaymentTypeService) {}

  /**
   * Handle the creation of a new payment type
   * @param dto - Data required to create a new payment type
   * @returns The created payment type
   */
  @ApiOperation({ summary: 'Create a new payment type' })
  @ApiCreatedResponse({
    description: 'Successfully created payment type.',
    type: PaymentTypeDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: CreatePaymentTypeDto })
  @Post()
  async create(@Body() dto: CreatePaymentTypeDto): Promise<PaymentType> {
    this.logger.log('Handling POST request to create payment type');
    return this.paymentTypeService.createPaymentType(dto);
  }

  /**
   * Update a specific payment type by user ID
   * @param userId - The ID of the user
   * @param dto - Data to update the payment type
   * @returns The updated payment type
   */
  @ApiOperation({ summary: 'Update a payment type by user ID' })
  @ApiOkResponse({
    description: 'Successfully updated payment type.',
    type: PaymentTypeDto,
  })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdatePaymentTypeDto })
  @ApiParam({ name: 'userId', type: String })
  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() dto: UpdatePaymentTypeDto,
  ): Promise<PaymentType> {
    this.logger.log(
      `Handling PATCH request to update payment type for user ${userId}`,
    );
    return this.paymentTypeService.updatePaymentType(userId, dto);
  }

  /**
   * Retrieve a specific payment type by user ID
   * @param userId - The ID of the user
   * @returns The payment type for the specified user
   */
  @ApiOperation({ summary: 'Get a payment type by user ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved payment type.',
    type: PaymentTypeDto,
  })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  @ApiParam({ name: 'userId', type: String })
  @Get(':userId')
  findByUserId(@Param('userId') userId: string): Promise<PaymentTypeDto> {
    this.logger.log(
      `Handling GET request to retrieve payment type for user ${userId}`,
    );
    return this.paymentTypeService.getPaymentTypeByUserId(userId);
  }

  /**
   * Delete a specific payment type by user ID
   * @param userId - The ID of the user
   */
  @ApiOperation({ summary: 'Delete a payment type by user ID' })
  @ApiOkResponse({ description: 'Successfully deleted payment type.' })
  @ApiNotFoundResponse({ description: 'Payment Type not found' })
  @ApiParam({ name: 'userId', type: String })
  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<void> {
    this.logger.log(
      `Handling DELETE request to remove payment type for user ${userId}`,
    );
    await this.paymentTypeService.deletePaymentType(userId);
  }
}
