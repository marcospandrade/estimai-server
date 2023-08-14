import { Injectable } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianService } from 'src/core/atlassian/atlassian.service';
import { AtlassianHelper } from 'src/core/atlassian/helpers/atlassian.helper';

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

    const userExists = await this.authFactoryService.checkUserExists(state);

    if (userExists) {
      return userExists;
    }

    const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(
      code,
    );

    const userInfo = await this.atlassianService.getUserInformation(
      exchangedCode.access_token,
    );

    const createUser: ICreateUserDTO = {
      accessToken: exchangedCode.access_token,
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
}
