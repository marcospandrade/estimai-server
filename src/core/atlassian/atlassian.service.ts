import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
  IAtlassianConfig,
  IExchangeCodeToAccessTokenAtlassian,
  IExchangeResponse,
} from '../config/interfaces/config-atlassian.model';
import { ConfigService } from '../config/config.service';
import { UserAtlassianInfo } from './interfaces/user-info.model';

@Injectable()
export class AtlassianService {
  private readonly logger = new Logger(AtlassianService.name);
  private configAtlassian: IAtlassianConfig;

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.configAtlassian = this.configService.getAtlassian();
  }

  public async exchangeCodeToAccessToken(
    code: string,
  ): Promise<IExchangeResponse> {
    const payloadAuthAtlassian: IExchangeCodeToAccessTokenAtlassian = {
      grant_type: 'authorization_code',
      client_id: this.configAtlassian.clientId,
      client_secret: this.configAtlassian.clientSecret,
      code: code,
      redirect_uri: this.configAtlassian.callbackUrl,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post('https://auth.atlassian.com/oauth/token', payloadAuthAtlassian)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new InternalServerErrorException(error.response?.data);
          }),
        ),
    );

    return data;
  }

  public async getUserInformation(
    accessToken: string,
  ): Promise<UserAtlassianInfo> {
    const { data } = await firstValueFrom(
      this.httpService.get<UserAtlassianInfo>('https://api.atlassian.com/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return data;
  }
}
