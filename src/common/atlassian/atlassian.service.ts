import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
  IAtlassianConfig,
  IExchangeCodeToAccessTokenAtlassian,
  IExchangeResponse,
  IRefreshTokenAtlassian,
} from '../interfaces/config-atlassian.model';

import { UserAtlassianInfo } from './interfaces/user-info.model';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IAccessibleResources } from './interfaces/accessible-resources';
import { EstimAiConfig } from 'src/app.module';

@Injectable()
export class AtlassianService {
  private readonly logger = new Logger(AtlassianService.name);
  private configAtlassian: IAtlassianConfig;

  public constructor(
    private readonly configService: ConfigService<EstimAiConfig>,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getToken(userEmail: string) {
    const userAuthInfo = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
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

    return this.refreshToken(userEmail, userAuthInfo.refreshToken);
  }

  public async exchangeCodeToAccessToken(code: string): Promise<IExchangeResponse> {
    const payloadAuthAtlassian: IExchangeCodeToAccessTokenAtlassian = {
      grant_type: 'authorization_code',
      client_id: this.configService.get('ATLASSIAN_CLIENT_ID') ?? '',
      client_secret: this.configService.get('ATLASSIAN_CLIENT_SECRET') ?? '',
      code,
      redirect_uri: this.configService.get('ATLASSIAN_CALLBACK_URL') ?? '',
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

  public async getAccessibleResources(accessToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IAccessibleResources[]>('https://api.atlassian.com/oauth/token/accessible-resources', {
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

    return data[0];
  }

  public async genericAtlassianCall(url: string, userEmail: string) {
    const accessToken = await this.getToken(userEmail);
    const authHeader = `Basic ${Buffer.from(userEmail + ':' + accessToken).toString('base64')}`;

    const { data } = await firstValueFrom(
      this.httpService
        .get<UserAtlassianInfo>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          // headers: {
          //   Authorization: authHeader,
          // },
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

  public async getIssues(cloudId: string, userEmail: string) {
    const urlGetIssues = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

    return this.genericAtlassianCall(urlGetIssues, userEmail);
  }

  private async refreshToken(userEmail: string, refreshToken: string): Promise<string> {
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
        email: userEmail,
      },
      data: {
        refreshToken: data.refresh_token,
        accessTokenAtlassian: data.access_token,
      },
    });

    return data.access_token;
  }
}
