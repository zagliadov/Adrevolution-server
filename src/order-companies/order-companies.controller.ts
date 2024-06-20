// src/order-companies/order-companies.controller.ts
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
  CreateOrderCompaniesDto,
  UpdateOrderCompaniesDto,
  OrderCompaniesDto,
} from './dto';
import { OrderCompaniesService } from './order-companies.service';

@ApiTags('Order Companies')
@Controller('order-companies')
export class OrderCompaniesController {
  private readonly logger = new Logger(OrderCompaniesController.name);

  constructor(private readonly orderCompaniesService: OrderCompaniesService) {}

  /**
   * Handle the creation of a new order company
   * @param data - Data required to create a new order company
   * @returns The created order company
   */
  @ApiOperation({ summary: 'Create a new order company' })
  @ApiOkResponse({
    description: 'Successfully created order company.',
    type: OrderCompaniesDto,
  })
  @Post()
  async createOrderCompany(@Body() data: CreateOrderCompaniesDto) {
    this.logger.log('Handling POST request to create order company');
    return this.orderCompaniesService.createOrderCompany(data);
  }

  /**
   * Retrieve all companies for an order
   * @returns A list of order companies
   * Retrieve all companies for an order, retrieving all companies involved in a specific order, either as a contractor or a subcontractor.
   */
  @ApiOperation({ summary: 'Get all companies for an order' })
  @ApiOkResponse({
    description: 'Successfully retrieved all companies for an order.',
    type: [OrderCompaniesDto],
  })
  @Get()
  async findOrderCompanies(@Query('orderId') orderId: string) {
    this.logger.log(
      'Handling GET request to retrieve all companies for an order',
    );
    return this.orderCompaniesService.findOrderCompanies(orderId);
  }

  /**
   * Retrieve a specific order company by its ID
   * @param id - The ID of the order company
   * @returns The order company with the specified ID
   */
  @ApiOperation({ summary: 'Get an order company by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved order company.',
    type: OrderCompaniesDto,
  })
  @ApiResponse({ status: 404, description: 'Order company not found' })
  @Get(':id')
  async findOneOrderCompany(@Param('id') id: string) {
    this.logger.log(
      `Handling GET request to retrieve order company with ID ${id}`,
    );
    return this.orderCompaniesService.findOneOrderCompany(id);
  }

  /**
   * Update a specific order company by its ID
   * @param id - The ID of the order company to be updated
   * @param updateOrderCompaniesDto - Data to update the order company
   * @returns The updated order company
   */
  @ApiOperation({ summary: 'Update an order company by ID' })
  @ApiBody({ type: UpdateOrderCompaniesDto })
  @ApiOkResponse({
    description: 'Successfully updated order company.',
    type: OrderCompaniesDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Patch(':id')
  async updateOrderCompany(
    @Param('id') id: string,
    @Body() updateOrderCompaniesDto: UpdateOrderCompaniesDto,
  ) {
    this.logger.log(
      `Handling PATCH request to update order company with ID ${id}`,
    );
    return this.orderCompaniesService.updateOrderCompany(
      id,
      updateOrderCompaniesDto,
    );
  }

  /**
   * Delete a specific order company by its ID
   * @param id - The ID of the order company to be deleted
   */
  @ApiOperation({ summary: 'Delete an order company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted order company.',
  })
  @ApiResponse({ status: 404, description: 'Order company not found' })
  @Delete(':id')
  async removeOrderCompany(@Param('id') id: string) {
    this.logger.log(
      `Handling DELETE request to remove order company with ID ${id}`,
    );
    return this.orderCompaniesService.removeOrderCompany(id);
  }
}
