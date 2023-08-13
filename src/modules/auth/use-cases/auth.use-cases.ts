import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/register.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianService } from 'src/core/atlassian/atlassian.service';
import { IAtlassianAuth } from 'src/core/config/interfaces/config-atlassian.model';

@Injectable()
export class AuthUseCase {
  public constructor(
    private readonly authFactoryService: AuthFactoryService,
    private readonly atlassianService: AtlassianService,
  ) {}

  public async register(registerDto: IAuth) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(
      code,
    );

    const userInfo = await this.atlassianService.getUserInformation(
      exchangedCode.access_token,
    );

    const createUser: ICreateUserDTO = {
      accessToken: exchangedCode.access_token,
      refreshToken: exchangedCode.refresh_token,
      state,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      jobTitle: userInfo.extended_profile.job_title,
    };

    const userCreated = await this.authFactoryService.createUser(createUser);

    // console.log(response.data);
    return userCreated;
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

  public async getUserAccessToken(userId: string): Promise<IAtlassianAuth> {
    try {
      return this.authFactoryService.getAtlassianAccessToken(userId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
