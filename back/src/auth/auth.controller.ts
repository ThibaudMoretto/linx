import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const user = await this.authService.validateUser(body.username, body.password);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return { message: 'Unauthorized' };
    }
    const token = await this.authService.login(user);
    console.log('token', token);

    return res.json(token);
  }

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body.username, body.password);
  }
}
