import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { NewRequest } from 'src/shared/NewRequest';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('jira')
  @UseGuards(AuthGuard('jira'))
  public jiraLogin() {
    return 'start jira oauth2 flow';
  }

  @Get('jira/callback')
  @UseGuards(AuthGuard('jira'))
  jiraCallback(@Req() req: NewRequest, @Res() res: Response) {
    // Handles the OAuth 2.0 callback
    const { accessToken } = req.user;
    res.redirect(`http://localhost:3000?access_token=${accessToken}`);
  }
}
