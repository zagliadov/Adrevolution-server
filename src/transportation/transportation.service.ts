import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class TransportationService {
  private readonly logger = new Logger(TransportationService.name);

  constructor(private db: DbService) {}

  /**
   * Create transport assets for a company
   * @param companyId - ID of the company
   * @throws InternalServerErrorException - If creating transport assets fails
   */
  async createTransportAssets(companyId: string) {
    this.logger.log(`Creating transport assets for company ${companyId}`);

    try {
      await this.db.transport.create({
        data: {
          name: 'Default Truck',
          company: {
            connect: { id: companyId },
          },
          load: {
            create: [
              {
                description: 'Initial Load',
                weight: 1000,
              },
            ],
          },
        },
      });

      this.logger.log(
        `Successfully created transport assets for company ${companyId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create transport assets for company ${companyId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create transport assets',
      );
    }
  }
}
