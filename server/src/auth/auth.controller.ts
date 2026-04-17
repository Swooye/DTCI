import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('code') code: string, @Body('phoneCode') phoneCode?: string) {
    return this.authService.login(code, phoneCode);
  }
}
