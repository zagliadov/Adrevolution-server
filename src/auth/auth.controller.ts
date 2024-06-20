import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { GetSessionInfoDto, SignInBodyDto, SignUpBodyDto } from './dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private cookieService: CookieService,
  ) {}

  /**
   * Sign up a new user
   * @param body - The sign-up data
   * @param res - The response object to set the token
   */
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ description: 'Successfully signed up a new user.' })
  @ApiBody({ type: SignUpBodyDto })
  @Post('sign-up')
  async signUp(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.logger.log(`Signing up new user: ${body.email}`);
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
    );
    this.cookieService.setToken(res, accessToken);
  }

  /**
   * Sign in an existing user
   * @param body - The sign-in data
   * @param res - The response object to set the token
   */
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiOkResponse({ description: 'Successfully signed in the user.' })
  @ApiBody({ type: SignInBodyDto })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() body: SignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.logger.log(`Signing in user: ${body.email}`);
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );
    this.cookieService.setToken(res, accessToken);
  }

  /**
   * Sign out the current user
   * @param res - The response object to remove the token
   */
  @ApiOperation({ summary: 'Sign out the current user' })
  @ApiOkResponse({ description: 'Successfully signed out the user.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response): void {
    this.logger.log('Signing out user');
    this.cookieService.removeToken(res);
  }

  /**
   * Get the session information of the current user
   * @param session - The session information of the current user
   * @returns The session information
   */
  @ApiOperation({ summary: 'Get session information' })
  @ApiOkResponse({
    description: 'Successfully retrieved session information.',
    type: GetSessionInfoDto,
  })
  @UseGuards(AuthGuard)
  @Get('session')
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto): GetSessionInfoDto {
    this.logger.log(`Retrieving session information for user ${session.id}`);
    return session;
  }

  /**
   * Verify a user and set their password
   * @param token - The verification token
   * @param password - The new password
   * @returns The result of the verification and password setting
   */
  @ApiOperation({ summary: 'Verify user and set password' })
  @ApiOkResponse({
    description: 'Successfully verified user and set password.',
  })
  @ApiParam({ name: 'token', type: String })
  @Patch('verify/:token')
  @HttpCode(HttpStatus.OK)
  async verifyUserAndSetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ): Promise<void> {
    this.logger.log(`Verifying user with token ${token}`);
    await this.authService.verifyUserAndSetPassword(token, password);
  }

  /**
   * Get user by verification token
   * @param token - The verification token
   * @returns The user associated with the verification token
   */
  @ApiOperation({ summary: 'Get user by verification token' })
  @ApiOkResponse({ description: 'Successfully retrieved user by token.' })
  @ApiParam({ name: 'token', type: String })
  @Get('user/:token')
  async getUserByToken(@Param('token') token: string): Promise<{
    email: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    companyName: string;
  }> {
    this.logger.log(`Getting user by token ${token}`);
    const user = await this.usersService.getUserByVerificationToken(token);
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
    };
  }
}

// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   Res,
//   UseGuards,
// } from '@nestjs/common';
// import { GetSessionInfoDto, SignInBodyDto, SignUpBodyDto } from './dto';
// import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { AuthService } from './auth.service';
// import { Response } from 'express';
// import { CookieService } from './cookie.service';
// import { AuthGuard } from './auth.guard';
// import { SessionInfo } from './session-info.decorator';
// import { UsersService } from 'src/users/users.service';

// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private usersService: UsersService,
//     private cookieService: CookieService,
//   ) {}

//   // POST /auth/sign-up
//   @Post('sign-up')
//   @ApiCreatedResponse()
//   async signUp(
//     @Body() body: SignUpBodyDto,
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     const { accessToken } = await this.authService.signUp(
//       body.email,
//       body.password,
//     );
//     this.cookieService.setToken(res, accessToken);
//   }

//   // *************************SIGN IN */
//   @Post('sign-in')
//   @ApiOkResponse()
//   @HttpCode(HttpStatus.OK)
//   async signIn(
//     @Body() body: SignInBodyDto,
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     const { accessToken } = await this.authService.signIn(
//       body.email,
//       body.password,
//     );
//     this.cookieService.setToken(res, accessToken);
//   }

//   // *************************SIGN OUT */
//   @Post('sign-out')
//   @ApiOkResponse()
//   @HttpCode(HttpStatus.OK)
//   @UseGuards(AuthGuard)
//   signOut(@Res({ passthrough: true }) res: Response) {
//     this.cookieService.removeToken(res);
//   }

//   // *************************GET SESSION */
//   @Get('session')
//   @ApiOkResponse({
//     type: GetSessionInfoDto,
//   })
//   @UseGuards(AuthGuard)
//   getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
//     return session;
//   }

//   @Patch('verify/:token')
//   @HttpCode(HttpStatus.OK)
//   async verifyUserAndSetPassword(
//     @Param('token') token: string,
//     @Body('password') password: string,
//   ) {
//     return this.authService.verifyUserAndSetPassword(token, password);
//   }

//   @Get('user/:token')
//   async getUserByToken(@Param('token') token: string) {
//     const user = await this.usersService.getUserByVerificationToken(token);
//     return {
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       companyName: user.companyName,
//     };
//   }
// }
