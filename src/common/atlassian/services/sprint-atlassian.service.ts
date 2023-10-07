import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
  IAtlassianConfig,
  IExchangeCodeToAccessTokenAtlassian,
  IExchangeResponse,
  IRefreshTokenAtlassian,
} from '../../interfaces/config-atlassian.model';
import { ConfigService } from '../../config/config.service';
import { UserAtlassianInfo } from '../interfaces/user-info.model';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class SprintAtlassianService {
  private readonly logger = new Logger(SprintAtlassianService.name);
  private configAtlassian: IAtlassianConfig;

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {
    this.configAtlassian = this.configService.getAtlassian();
  }

  public async getIssues() {
    const { data } = await firstValueFrom(this.httpService.get(''));
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
}
