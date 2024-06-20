// src/orders/orders.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private db: DbService) {}

  /**
   * Create a new order
   * @param data - Data required to create a new order
   * @returns The created order
   */
  async createOrder(data: CreateOrderDto): Promise<Order> {
    try {
      this.logger.log('Creating a new order');
      return await this.db.order.create({ data });
    } catch (error) {
      this.logger.error('Failed to create order', error.stack);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  // /**
  //  * Retrieve all orders
  //  * @returns A list of orders
  //  */
  // async findAllCompanyOrders(companyId: string): Promise<Order[]> {
  //   try {
  //     this.logger.log('Retrieving all company orders');
  //     return await this.db.order.findMany({
  //       where: { companyId },
  //     });
  //   } catch (error) {
  //     this.logger.error('Failed to retrieve company orders', error.stack);
  //     throw new InternalServerErrorException(
  //       'Failed to retrieve company orders',
  //     );
  //   }
  // }

  /**
   * Retrieve a specific order by its ID
   * @param id - The ID of the order
   * @returns The order with the specified ID
   */
  async findOneOrder(id: string): Promise<Order> {
    try {
      this.logger.log(`Retrieving order with ID ${id}`);
      const order = await this.db.order.findUnique({ where: { id } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve order with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve order');
    }
  }

  /**
   * Update a specific order by its ID
   * @param id - The ID of the order to be updated
   * @param updateOrderDto - Data to update the order
   * @returns The updated order
   */
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      this.logger.log(`Updating order with ID ${id}`);
      return await this.db.order.update({
        where: { id },
        data: updateOrderDto,
      });
    } catch (error) {
      this.logger.error(`Failed to update order with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  /**
   * Delete a specific order by its ID
   * @param id - The ID of the order to be deleted
   */
  async removeOrder(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting order with ID ${id}`);
      await this.db.order.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Failed to delete order with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}
