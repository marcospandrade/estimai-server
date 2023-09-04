import { Injectable, UnauthorizedException } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianService } from '../../../core/atlassian/atlassian.service';
import { AtlassianHelper } from '../../../core/atlassian/helpers/atlassian.helper';

@Injectable()
export class AuthUseCase {
  public constructor(
    private readonly authFactoryService: AuthFactoryService,
    private readonly atlassianService: AtlassianService,
  ) {}

  public async login(registerDto: IAuth) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(code);

    const userInfo = await this.atlassianService.getUserInformation(exchangedCode.access_token);

    const userExists = await this.authFactoryService.checkUserExists(userInfo.email);

    if (userExists) {
      return userExists;
    }

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

    const userCreated = await this.authFactoryService.createUser(createUser);

    return userCreated;
  }

  public async checkUser(email: string) {
    const user = await this.authFactoryService.checkUserExists(email);

    if (!user) {
      throw new UnauthorizedException(`User ${email} does not exist`);
    }

    return user;
  }
}
