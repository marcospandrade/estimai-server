import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { z } from 'zod';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { AuthFactoryService } from './auth-factory.service';
import axios from 'axios';
import {
  IExchangeCodeToAccessTokenAtlassian,
  IRefreshTokenAtlassian,
} from 'src/core/config/interfaces/config-atlassian.model';
import { AtlassianService } from 'src/core/atlassian/atlassian.service';

@Injectable()
export class AuthUseCase {
  public constructor(
    private readonly authService: AuthFactoryService,
    private readonly atlassianService: AtlassianService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(
      code,
    );

    // const user = await this.authService.createUser({ code, state });

    // console.log(response.data);
    return exchangedCode;
  }

  public async refreshAtlassianToken(refreshToken: string) {
    // const payloadRefreshToken: IRefreshTokenAtlassian = {
    //   grant_type: 'refresh_token',
    //   client_id: this.CLIENT_ID,
    //   client_secret: this.CLIENT_SECRET,
    //   refresh_token: refreshToken,
    // };
    // const response = await axios.post(
    //   `https://auth.atlassian.com/oauth/token`,
    //   payloadRefreshToken,
    // );
  }
}
