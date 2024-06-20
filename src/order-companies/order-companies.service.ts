import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateOrderCompaniesDto, UpdateOrderCompaniesDto } from './dto';
import { OrderCompanies } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class OrderCompaniesService {
  private readonly logger = new Logger(OrderCompaniesService.name);

  constructor(private db: DbService) {}

  /**
   * Create a new order company
   * @param data - Data required to create a new order company
   * @returns The created order company
   */
  async createOrderCompany(
    data: CreateOrderCompaniesDto,
  ): Promise<OrderCompanies> {
    try {
      this.logger.log('Creating a new order company');
      return await this.db.orderCompanies.create({ data });
    } catch (error) {
      this.logger.error('Failed to create order company', error.stack);
      throw new InternalServerErrorException('Failed to create order company');
    }
  }

  /**
   * Retrieve all order companies for an order
   * @param orderId - The ID of the order
   * @returns A list of order companies
   */
  async findOrderCompanies(orderId: string): Promise<OrderCompanies[]> {
    try {
      this.logger.log(`Retrieving companies for order with ID ${orderId}`);
      return await this.db.orderCompanies.findMany({
        where: { orderId },
      });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve companies for order with ID ${orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve order companies',
      );
    }
  }

  /**
   * Retrieve a specific order company by its ID
   * @param id - The ID of the order company
   * @returns The order company with the specified ID
   */
  async findOneOrderCompany(id: string): Promise<OrderCompanies> {
    try {
      this.logger.log(`Retrieving order company with ID ${id}`);
      const orderCompany = await this.db.orderCompanies.findUnique({
        where: { id },
      });
      if (!orderCompany) {
        throw new NotFoundException('Order company not found');
      }
      return orderCompany;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve order company with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve order company',
      );
    }
  }

  /**
   * Update a specific order company by its ID
   * @param id - The ID of the order company to be updated
   * @param updateOrderCompaniesDto - Data to update the order company
   * @returns The updated order company
   */
  async updateOrderCompany(
    id: string,
    updateOrderCompaniesDto: UpdateOrderCompaniesDto,
  ): Promise<OrderCompanies> {
    try {
      this.logger.log(`Updating order company with ID ${id}`);
      return await this.db.orderCompanies.update({
        where: { id },
        data: updateOrderCompaniesDto,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update order company with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update order company');
    }
  }

  /**
   * Delete a specific order company by its ID
   * @param id - The ID of the order company to be deleted
   */
  async removeOrderCompany(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting order company with ID ${id}`);
      await this.db.orderCompanies.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to delete order company with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete order company');
    }
  }
}
