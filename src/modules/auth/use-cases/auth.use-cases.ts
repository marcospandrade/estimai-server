import { Injectable } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianService } from 'src/core/atlassian/atlassian.service';
import { AtlassianHelper } from 'src/core/atlassian/helpers/atlassian.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthUseCase {
  public constructor(
    private readonly authFactoryService: AuthFactoryService,
    private readonly atlassianService: AtlassianService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(registerDto: IAuth) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    const userExists = await this.authFactoryService.checkUserExists(state);

    if (userExists) {
      return userExists;
    }

    const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(code);

    const userInfo = await this.atlassianService.getUserInformation(exchangedCode.access_token);

    const accessTokenEstimai = await this.authFactoryService.generateJwtToken(state, userInfo);

    const createUser: ICreateUserDTO = {
      accessTokenEstimai,
      accessTokenAtlassian: exchangedCode.access_token,
      refreshToken: exchangedCode.refresh_token,
      expiresAt: AtlassianHelper.calculateExpiresAt(exchangedCode.expires_in),
      state,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      jobTitle: userInfo.extended_profile.job_title,
    };

    await this.authFactoryService.createUser(createUser);

    return accessTokenEstimai;
  }
}
