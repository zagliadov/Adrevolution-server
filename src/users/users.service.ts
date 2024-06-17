import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';
import {
  PatchUserDto,
  UserDto,
  UserSecretDto,
  UserWithoutPassword,
  VerificationTokenDto,
} from './dto';
import { CompanyService } from 'src/company/company.service';
import { CompanyDetailsService } from 'src/company-details/company-details.service';
import { BusinessHoursService } from 'src/business-hours/business-hours.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { LabourCostService } from 'src/labour-cost/labour-cost.service';
import { CommunicationsService } from 'src/communications/communications.service';
import { AuthService } from 'src/auth/auth.service';
import { PermissionLevel } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private db: DbService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private companyDetailsService: CompanyDetailsService,
    private businessHoursService: BusinessHoursService,
    private permissionsService: PermissionsService,
    private labourCostService: LabourCostService,
    private communicationsService: CommunicationsService,
  ) {}

  /**
   * Find user by email
   * @param email - Email of the user
   * @returns User object if found
   */
  async findByEmail(email: string): Promise<UserSecretDto | null> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      return await this.db.user.findFirst({ where: { email } });
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw new InternalServerErrorException(
        'Unable to find user by email. Please try again later.',
      );
    }
  }

  /**
   * Create a new user
   * @param email - Email of the new user
   * @param hash - Password hash
   * @param salt - Password salt
   */
  async create(email: string, hash: string, salt: string) {
    try {
      const user = await this.db.user.create({
        data: { email, hash, salt },
      });
      await this.accountService.create(user.id);
      const company = await this.companyService.create(user.id);
      const companyDetails = await this.companyDetailsService.create(user.id);
      await this.companyService.connectCompanyDetailsToCompany(
        companyDetails.id,
        company.id,
      );

      if (!company.id) return;

      await this.companyService.addUserToCompany(user.id, company.id);
      await this.businessHoursService.create(user.id);
      await this.communicationsService.create(user.id);
      await this.labourCostService.createLabourCost({ userId: user.id });
      await this.permissionsService.create(
        user.id,
        company.id,
        user.id === company.ownerId
          ? PermissionLevel.COMPANY_OWNER
          : PermissionLevel.MANAGER,
        true,
        user.id === company.ownerId,
      );
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  /**
   * Update user details
   * @param patch - Partial user details
   * @param userId - ID of the user to update
   */
  async patchUser(patch: PatchUserDto, userId: string): Promise<UserDto> {
    try {
      return await this.db.user.update({
        where: { id: userId },
        data: { ...patch },
      });
    } catch (error) {
      this.logger.error('Error updating user details', error.stack);
      throw new InternalServerErrorException(
        'Unable to update user details. Please try again later.',
      );
    }
  }

  /**
   * Create a new user without a password
   * @param body - User details
   */
  async createUserWithoutPassword(body: UserWithoutPassword) {
    const {
      email,
      firstName,
      lastName,
      streetAddress,
      city,
      province,
      postalCode,
      country,
      phoneNumber,
      companyId,
      inviterFirstName,
      inviterLastName,
      labourCost,
      costUnit,
      isAdmin,
      permissionLevel,
      surveys,
    } = body;

    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }

    try {
      const newUser = await this.db.user.create({
        data: {
          email,
          hash: '', // temporary value
          salt: '', // temporary value
          firstName,
          lastName,
          streetAddress,
          city,
          province,
          postalCode,
          country,
          phoneNumber,
          companyId,
        },
      });

      if (!companyId) return;
      const company = await this.companyService.addUserToCompany(
        newUser.id,
        companyId,
      );
      await this.accountService.create(newUser.id);
      await this.businessHoursService.create(newUser.id);
      await this.communicationsService.create(newUser.id);
      await this.communicationsService.updateCommunications(newUser.id, {
        surveys: surveys,
      });
      await this.labourCostService.createLabourCost({
        userId: newUser.id,
      });
      await this.labourCostService.updateLabourCost(newUser.id, {
        labourCost: labourCost,
        costUnit: costUnit,
      });

      await this.permissionsService.create(
        newUser.id,
        companyId,
        permissionLevel as PermissionLevel,
        isAdmin,
      );

      await this.authService.sendVerificationEmail(
        newUser.email!,
        newUser.id!,
        newUser.firstName!,
        newUser.lastName!,
        company.companyName!,
        inviterFirstName!,
        inviterLastName!,
      );

      return newUser;
    } catch (error) {
      this.logger.error('Error creating user without password', error.stack);
      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  /**
   * Save verification token
   * @param userId - ID of the user
   * @param token - Verification token
   */
  async saveVerificationToken(userId: string, token: string) {
    try {
      await this.db.verificationToken.create({
        data: { userId, token },
      });
    } catch (error) {
      this.logger.error('Error saving verification token', error.stack);
      throw new InternalServerErrorException(
        'Unable to save verification token. Please try again later.',
      );
    }
  }

  /**
   * Find verification token
   * @param token - Verification token
   * @returns Verification token object if found
   */
  async findVerificationToken(
    token: string,
  ): Promise<VerificationTokenDto | null> {
    try {
      return await this.db.verificationToken.findUnique({
        where: { token },
      });
    } catch (error) {
      this.logger.error('Error finding verification token', error.stack);
      throw new InternalServerErrorException(
        'Unable to find verification token. Please try again later.',
      );
    }
  }

  /**
   * Update user password
   * @param userId - ID of the user
   * @param hash - New password hash
   * @param salt - New password salt
   */
  async updateUserPassword(userId: string, hash: string, salt: string) {
    this.logger.log(`Updating password for user ${userId}`);
    try {
      await this.db.user.update({
        where: { id: userId },
        data: { hash, salt },
      });
    } catch (error) {
      this.logger.error('Error updating user password', error.stack);
      throw new InternalServerErrorException(
        'Unable to update user password. Please try again later.',
      );
    }
  }

  /**
   * Delete verification token
   * @param token - Verification token
   */
  async deleteVerificationToken(token: string) {
    try {
      await this.db.verificationToken.delete({
        where: { token },
      });
    } catch (error) {
      this.logger.error('Error deleting verification token', error.stack);
      throw new InternalServerErrorException(
        'Unable to delete verification token. Please try again later.',
      );
    }
  }

  async getUserByVerificationToken(
    token: string,
  ): Promise<UserDto & { companyName: string }> {
    const tokenRecord = await this.findVerificationToken(token);
    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired token');
    }
    const user = await this.getUserById(tokenRecord.userId);
    if (!user.companyId) {
      throw new InternalServerErrorException(
        'User does not belong to any company',
      );
    }

    const company = await this.db.company.findUnique({
      where: { id: user.companyId },
      select: { companyName: true },
    });

    return { ...user, companyName: company?.companyName || '' };
  }

  /**
   * Get user details by ID
   * @param userId - ID of the user
   * @returns User details object if found
   */
  async getUserDetails(userId: string): Promise<UserDto> {
    try {
      const user = await this.db.user.findUniqueOrThrow({
        where: { id: userId },
      });
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin,
        streetAddress: user.streetAddress,
        city: user.city,
        province: user.province,
        postalCode: user.postalCode,
        country: user.country,
        phoneNumber: user.phoneNumber,
        companyId: user.companyId,
      };
    } catch (error) {
      this.logger.error('Error getting user details', error.stack);
      throw new InternalServerErrorException(
        'Unable to get user details. Please try again later.',
      );
    }
  }

  /**
   * Update user's last login time
   * @param userId - ID of the user
   */
  async updateLastLogin(userId: string) {
    try {
      return await this.db.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      this.logger.error('Error updating last login', error.stack);
      throw new InternalServerErrorException(
        'Unable to update last login. Please try again later.',
      );
    }
  }

  /**
   * Get user by ID
   * @param userId - ID of the user
   * @returns User object if found
   */
  async getUserById(userId: string): Promise<UserDto> {
    try {
      const user = await this.db.user.findUniqueOrThrow({
        where: { id: userId },
      });
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin,
        streetAddress: user.streetAddress,
        city: user.city,
        province: user.province,
        postalCode: user.postalCode,
        country: user.country,
        phoneNumber: user.phoneNumber,
        companyId: user.companyId,
      };
    } catch (error) {
      this.logger.error('Error getting user by ID', error.stack);
      throw new InternalServerErrorException(
        'Unable to get user by ID. Please try again later.',
      );
    }
  }

  /**
   * Delete a user and all related records
   * @param userId - ID of the user to delete
   * @param requesterId - ID of the user requesting the deletion
   */
  async deleteUser(userId: string, requesterId: string) {
    this.logger.log(
      `Request to delete user with ID: ${userId} by requester ID: ${requesterId}`,
    );

    try {
      // Check if the user is the owner of the company
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: { ownedCompany: true },
      });

      if (user?.ownedCompany) {
        throw new ForbiddenException(
          'You cannot delete the owner of the company.',
        );
      }

      // Start a transaction
      await this.db.$transaction(async (prisma) => {
        // Delete all related records
        await prisma.verificationToken.deleteMany({
          where: { userId },
        });

        await prisma.labourCost.deleteMany({
          where: { userId },
        });

        await prisma.communication.deleteMany({
          where: { userId },
        });

        await prisma.permissions.deleteMany({
          where: { userId },
        });

        await prisma.businessHours.deleteMany({
          where: { ownerId: userId },
        });

        await prisma.account.deleteMany({
          where: { ownerId: userId },
        });

        // Remove the user from the company
        await prisma.user.update({
          where: { id: userId },
          data: { companyId: null },
        });

        // Delete the user record
        await prisma.user.delete({
          where: { id: userId },
        });
      });

      this.logger.log(`Successfully deleted user with ID: ${userId}`);
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${userId}`, error.stack);
      throw new InternalServerErrorException(
        'Unable to delete user. Please try again later.',
      );
    }
  }
}
