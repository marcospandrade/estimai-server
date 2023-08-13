import { Controller, Post, Body } from '@nestjs/common';

import { IAuth } from './dto/register.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('/register')
  public register(@Body() body: IAuth) {
    return this.authUseCase.register(body);
  }
}
