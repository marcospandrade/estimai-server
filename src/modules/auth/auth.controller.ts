import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';

import { IAuth } from './dto/login.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { RequestUser } from 'src/shared/helpers/generic.helpers';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CurrentUser } from '@common/current-user/current-user.decorator';

import { UserAtlassianInfo } from '@common/atlassian/interfaces/user-info.model';
import { FormatResponseInterceptor } from '@shared/interceptors/format-response/format-response.interceptor';

@Controller('auth')
@UseInterceptors(FormatResponseInterceptor)
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

  @UseGuards(AuthGuard)
  @Post('/refresh-token')
  refreshToken(@CurrentUser() user: UserAtlassianInfo) {
    return this.authUseCase.refreshToken(user.email);
  }
}
