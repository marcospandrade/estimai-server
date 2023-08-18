import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
  IAtlassianConfig,
  IExchangeCodeToAccessTokenAtlassian,
  IExchangeResponse,
  IRefreshTokenAtlassian,
} from '../config/interfaces/config-atlassian.model';
import { ConfigService } from '../config/config.service';
import { UserAtlassianInfo } from './interfaces/user-info.model';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AtlassianService {
  private readonly logger = new Logger(AtlassianService.name);
  private configAtlassian: IAtlassianConfig;

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {
    this.configAtlassian = this.configService.getAtlassian();
  }

  public async getToken(userId: string) {
    const userAuthInfo = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        accessTokenAtlassian: true,
        expiresAt: true,
        refreshToken: true,
      },
    });

    if (!userAuthInfo) {
      throw new NotFoundException('User not registered');
    }

    if (Date.now() < Number(userAuthInfo.expiresAt)) {
      return userAuthInfo.accessTokenAtlassian;
    }

    return this.refreshToken(userId, userAuthInfo.refreshToken);
  }

  public async exchangeCodeToAccessToken(code: string): Promise<IExchangeResponse> {
    const payloadAuthAtlassian: IExchangeCodeToAccessTokenAtlassian = {
      grant_type: 'authorization_code',
      client_id: this.configAtlassian.clientId,
      client_secret: this.configAtlassian.clientSecret,
      code: code,
      redirect_uri: this.configAtlassian.callbackUrl,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<IExchangeResponse>('https://auth.atlassian.com/oauth/token', payloadAuthAtlassian).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw new InternalServerErrorException(error.response?.data);
        }),
      ),
    );

    return data;
  }

  public async getUserInformation(accessToken: string): Promise<UserAtlassianInfo> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<UserAtlassianInfo>('https://api.atlassian.com/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new InternalServerErrorException(error.response?.data);
          }),
        ),
    );

    return data;
  }

  private async refreshToken(userId: string, refreshToken: string): Promise<string> {
    const payloadRefreshToken: IRefreshTokenAtlassian = {
      grant_type: 'refresh_token',
      client_id: this.configAtlassian.clientId,
      client_secret: this.configAtlassian.clientSecret,
      refresh_token: refreshToken,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<IExchangeResponse>(`https://auth.atlassian.com/oauth/token`, payloadRefreshToken).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw new InternalServerErrorException(error.response?.data);
        }),
      ),
    );

    this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: data.refresh_token,
        accessTokenAtlassian: data.access_token,
      },
    });

    return data.access_token;
  }
}
