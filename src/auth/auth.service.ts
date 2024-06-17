import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}
  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.usersService.create(email, hash, salt);
    if (!newUser) {
      throw new BadRequestException({ type: 'new user error' });
    }
    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
    });

    return { accessToken };
  }
  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const hash = this.passwordService.getHash(password, user?.salt);
    if (hash !== user?.hash) {
      throw new UnauthorizedException();
    }

    await this.usersService.updateLastLogin(user.id);

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async sendVerificationEmail(
    email: string,
    userId: string,
    firstName: string,
    lastName: string,
    companyName: string,
    inviterFirstName: string,
    inviterLastName: string,
  ) {
    const token = uuidv4();
    await this.db.verificationToken.create({
      data: {
        userId,
        token,
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'portal.sid.grand2@gmail.com',
        pass: 'ycxa bwdo zftx xmgk',
      },
    });

    const verificationUrl = `http://localhost:3001/auth/verify/${token}`;

    const mailOptions = {
      from: 'portal.sid.grand2@gmail.com',
      to: email,
      subject: `Invitation to Join ${companyName}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #4CAF50; color: white; padding: 20px;">
          <h2 style="margin: 0;">${inviterFirstName} ${inviterLastName} has invited you to join ${companyName}</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Hi ${firstName}, ${inviterFirstName} ${inviterLastName} has invited you to join <strong>${companyName}</strong> on the Adrevolution platform. Do your best work:</p>
          <ul style="list-style-type: none; padding: 0; font-size: 16px; color: #555;">
            <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-glyphs/30/4CAF50/checkmark.png" style="vertical-align: middle; margin-right: 10px;"/> View your schedule and get notified of changes</li>
            <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-glyphs/30/4CAF50/checkmark.png" style="vertical-align: middle; margin-right: 10px;"/> Access job details and checklists</li>
            <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-glyphs/30/4CAF50/checkmark.png" style="vertical-align: middle; margin-right: 10px;"/> Add notes and photos from the job site</li>
            <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-glyphs/30/4CAF50/checkmark.png" style="vertical-align: middle; margin-right: 10px;"/> Track your work hours</li>
          </ul>
          <p style="font-size: 16px;">Click below to finish your profile setup and join your team!</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 15px 25px; font-size: 18px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 20px;">Accept the Invitation</a>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyUserAndSetPassword(token: string, password: string) {
    const tokenRecord = await this.usersService.findVerificationToken(token);
    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired token');
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    // Update user's password with new hash and salt
    await this.usersService.updateUserPassword(tokenRecord.userId, hash, salt);

    // Remove the verification token
    await this.usersService.deleteVerificationToken(token);

    // Generate access token
    const user = await this.usersService.getUserById(tokenRecord.userId);
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
    return {
      message: 'Account verified successfully',
      accessToken,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
