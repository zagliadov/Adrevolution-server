import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateOrderResourcesDto,
  UpdateOrderResourcesDto,
  OrderResourcesDto,
} from './dto';
import { OrderResourcesService } from './order-resources.service';

@ApiTags('Order Resources')
@Controller('order-resources')
export class OrderResourcesController {
  private readonly logger = new Logger(OrderResourcesController.name);

  constructor(private readonly orderResourcesService: OrderResourcesService) {}

  /**
   * Handle the creation of a new order resource
   * @param data - Data required to create a new order resource
   * @returns The created order resource
   */
  @ApiOperation({ summary: 'Create a new order resource' })
  @ApiOkResponse({
    description: 'Successfully created order resource.',
    type: OrderResourcesDto,
  })
  @Post()
  async createOrderResource(@Body() data: CreateOrderResourcesDto) {
    this.logger.log('Handling POST request to create order resource');
    return this.orderResourcesService.createOrderResource(data);
  }

  /**
   * Retrieve all resources for an order
   * @returns A list of order resources
   */
  @ApiOperation({ summary: 'Get all resources for an order' })
  @ApiOkResponse({
    description: 'Successfully retrieved all resources for an order.',
    type: [OrderResourcesDto],
  })
  @Get()
  async findOrderResources(@Query('orderId') orderId: string) {
    this.logger.log(
      'Handling GET request to retrieve all resources for an order',
    );
    return this.orderResourcesService.findOrderResources(orderId);
  }

  /**
   * Retrieve a specific order resource by its ID
   * @param id - The ID of the order resource
   * @returns The order resource with the specified ID
   */
  @ApiOperation({ summary: 'Get an order resource by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved order resource.',
    type: OrderResourcesDto,
  })
  @ApiResponse({ status: 404, description: 'Order resource not found' })
  @Get(':id')
  async findOneOrderResource(@Param('id') id: string) {
    this.logger.log(
      `Handling GET request to retrieve order resource with ID ${id}`,
    );
    return this.orderResourcesService.findOneOrderResource(id);
  }

  /**
   * Update a specific order resource by its ID
   * @param id - The ID of the order resource to be updated
   * @param updateOrderResourcesDto - Data to update the order resource
   * @returns The updated order resource
   */
  @ApiOperation({ summary: 'Update an order resource by ID' })
  @ApiBody({ type: UpdateOrderResourcesDto })
  @ApiOkResponse({
    description: 'Successfully updated order resource.',
    type: OrderResourcesDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch(':id')
  async updateOrderResource(
    @Param('id') id: string,
    @Body() updateOrderResourcesDto: UpdateOrderResourcesDto,
  ) {
    this.logger.log(
      `Handling PATCH request to update order resource with ID ${id}`,
    );
    return this.orderResourcesService.updateOrderResource(
      id,
      updateOrderResourcesDto,
    );
  }

  /**
   * Delete a specific order resource by its ID
   * @param id - The ID of the order resource to be deleted
   */
  @ApiOperation({ summary: 'Delete an order resource by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted order resource.',
  })
  @ApiResponse({ status: 404, description: 'Order resource not found' })
  @Delete(':id')
  async removeOrderResource(@Param('id') id: string) {
    this.logger.log(
      `Handling DELETE request to remove order resource with ID ${id}`,
    );
    return this.orderResourcesService.removeOrderResource(id);
  }
}
