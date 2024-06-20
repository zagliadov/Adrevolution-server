import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static tokenKey = 'access-token';

  /**
   * Set a JWT token in the response cookies
   * @param res - The response object to set the cookie
   * @param token - The JWT token to be set
   */
  setToken(res: Response, token: string): void {
    res.cookie(CookieService.tokenKey, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  /**
   * Remove the JWT token from the response cookies
   * @param res - The response object to clear the cookie
   */
  removeToken(res: Response): void {
    res.clearCookie(CookieService.tokenKey);
  }
}
