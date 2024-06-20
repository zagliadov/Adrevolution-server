import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { OrderResources } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { CreateOrderResourcesDto, UpdateOrderResourcesDto } from './dto';

@Injectable()
export class OrderResourcesService {
  private readonly logger = new Logger(OrderResourcesService.name);

  constructor(private db: DbService) {}

  /**
   * Create a new order resource
   * @param data - Data required to create a new order resource
   * @returns The created order resource
   */
  async createOrderResource(
    data: CreateOrderResourcesDto,
  ): Promise<OrderResources> {
    try {
      this.logger.log('Creating a new order resource');
      return await this.db.orderResources.create({ data });
    } catch (error) {
      this.logger.error('Failed to create order resource', error.stack);
      throw new InternalServerErrorException('Failed to create order resource');
    }
  }

  /**
   * Retrieve all resources for an order
   * @param orderId - The ID of the order
   * @returns A list of order resources
   */
  async findOrderResources(orderId: string): Promise<OrderResources[]> {
    try {
      this.logger.log(`Retrieving resources for order with ID ${orderId}`);
      return await this.db.orderResources.findMany({
        where: { orderId },
      });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve resources for order with ID ${orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve order resources',
      );
    }
  }

  /**
   * Retrieve a specific order resource by its ID
   * @param id - The ID of the order resource
   * @returns The order resource with the specified ID
   */
  async findOneOrderResource(id: string): Promise<OrderResources> {
    try {
      this.logger.log(`Retrieving order resource with ID ${id}`);
      const orderResource = await this.db.orderResources.findUnique({
        where: { id },
      });
      if (!orderResource) {
        throw new NotFoundException('Order resource not found');
      }
      return orderResource;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve order resource with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve order resource',
      );
    }
  }

  /**
   * Update a specific order resource by its ID
   * @param id - The ID of the order resource to be updated
   * @param updateOrderResourcesDto - Data to update the order resource
   * @returns The updated order resource
   */
  async updateOrderResource(
    id: string,
    updateOrderResourcesDto: UpdateOrderResourcesDto,
  ): Promise<OrderResources> {
    try {
      this.logger.log(`Updating order resource with ID ${id}`);
      return await this.db.orderResources.update({
        where: { id },
        data: updateOrderResourcesDto,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update order resource with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update order resource');
    }
  }

  /**
   * Delete a specific order resource by its ID
   * @param id - The ID of the order resource to be deleted
   */
  async removeOrderResource(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting order resource with ID ${id}`);
      await this.db.orderResources.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to delete order resource with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete order resource');
    }
  }
}
