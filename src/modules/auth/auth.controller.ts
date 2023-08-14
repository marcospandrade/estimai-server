import { Controller, Post, Body } from '@nestjs/common';

import { IAuth } from './dto/login.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('/login')
  public login(@Body() body: IAuth) {
    return this.authUseCase.login(body);
  }
}
