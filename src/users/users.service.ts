import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';
import { PatchUserDto, UserWithoutPassword } from './dto';
import { CompanyService } from 'src/company/company.service';
import { CompanyDetailsService } from 'src/company-details/company-details.service';
import { BusinessHoursService } from 'src/business-hours/business-hours.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionLevel } from 'src/permissions/dto';
import { LabourCostService } from 'src/labour-cost/labour-cost.service';
import { CommunicationsService } from 'src/communications/communications.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
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
  async findByEmail(email: string) {
    return await this.db.user.findFirst({ where: { email } });
  }

  async create(email: string, hash: string, salt: string) {
    const user = await this.db.user.create({
      data: {
        email,
        hash,
        salt,
      },
    });

    await this.accountService.create(user.id);
    const company = await this.companyService.create(user.id);
    await this.companyDetailsService.create(user.id);
    if (!company.id) return;
    // Adding a user to the company
    await this.companyService.addUserToCompany(user.id, company.id);
    await this.businessHoursService.create(user.id);
    await this.communicationsService.create(user.id);
    await this.labourCostService.createLabourCost({
      userId: user.id,
    });
    await this.permissionsService.create(
      user.id,
      company.id,
      user.id === company.ownerId
        ? PermissionLevel.COMPANY_OWNER
        : PermissionLevel.MANAGER,
      true,
      user.id === company.ownerId, // Check if the user is the owner of the company
    );
    return user;
  }
  async patchUser(patch: PatchUserDto, userId: string) {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: { ...patch },
    });
  }

  // ***************************CREATE NEW USER WITHOUT PASSWORD */
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
    // Adding a user to the company
    const company = await this.companyService.addUserToCompany(
      newUser.id,
      companyId,
    );
    await this.accountService.create(newUser.id);
    await this.businessHoursService.create(newUser.id);

    // Create and update a record in Communication
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
  }

  async saveVerificationToken(userId: string, token: string) {
    await this.db.verificationToken.create({
      data: {
        userId,
        token,
      },
    });
  }

  async findVerificationToken(token: string) {
    return this.db.verificationToken.findUnique({
      where: { token },
    });
  }

  async updateUserPassword(userId: string, hash: string) {
    await this.db.user.update({
      where: { id: userId },
      data: {
        hash,
      },
    });
  }

  async deleteVerificationToken(token: string) {
    await this.db.verificationToken.delete({
      where: { token },
    });
  }

  // ***************************GET USER DETAILS */
  async getUserDetails(userId: string) {
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
    };
  }

  // ***************************UPDATE LAST LOGIN */
  async updateLastLogin(userId: string) {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }

  // ***************************GET USER BY ID */
  async getUserById(userId: string) {
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
    };
  }
}
