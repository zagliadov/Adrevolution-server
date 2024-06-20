import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateOrderDto, OrderDto, UpdateOrderDto } from './dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * Handle the creation of a new order
   * @param data - Data required to create a new order
   * @returns The created order
   */
  @ApiOperation({ summary: 'Create a new order' })
  @ApiOkResponse({
    description: 'Successfully created order.',
    type: OrderDto,
  })
  @Post()
  async createOrder(@Body() data: CreateOrderDto) {
    this.logger.log('Handling POST request to create order');
    return this.orderService.createOrder(data);
  }

  /**
   * Retrieve a specific order by its ID
   * @param id - The ID of the order
   * @returns The order with the specified ID
   */
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved order.',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':id')
  async findOneOrder(@Param('id') id: string) {
    this.logger.log(`Handling GET request to retrieve order with ID ${id}`);
    return this.orderService.findOneOrder(id);
  }

  /**
   * Update a specific order by its ID
   * @param id - The ID of the order to be updated
   * @param updateOrderDto - Data to update the order
   * @returns The updated order
   */
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Successfully updated order.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    this.logger.log(`Handling PATCH request to update order with ID ${id}`);
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  /**
   * Delete a specific order by its ID
   * @param id - The ID of the order to be deleted
   */
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted order.' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Delete(':id')
  async removeOrder(@Param('id') id: string) {
    this.logger.log(`Handling DELETE request to remove order with ID ${id}`);
    return this.orderService.removeOrder(id);
  }

  /**
   * Retrieve all orders for a company
   * @param companyId - The ID of the company
   * @returns A list of orders
   */
  @ApiOperation({ summary: 'Get all orders for a company' })
  @ApiOkResponse({
    description: 'Successfully retrieved all orders for a company.',
    type: [OrderDto],
  })
  @ApiParam({
    name: 'companyId',
    type: String,
    description: 'The ID of the company',
  })
  @Get(':companyId')
  async findAllCompanyOrders(
    @Param('companyId') companyId: string,
  ): Promise<OrderDto[]> {
    this.logger.log(
      `Handling GET request to retrieve all orders for company with ID ${companyId}`,
    );
    return this.orderService.findAllCompanyOrders(companyId);
  }
}
