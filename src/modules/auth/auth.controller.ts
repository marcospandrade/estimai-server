import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';

import { IAuth } from './dto/login.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { RequestUser } from 'src/shared/helpers/generic.helpers';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public login(@Body() body: IAuth) {
    return this.authUseCase.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestUser) {
    return req.user;
  }
}
