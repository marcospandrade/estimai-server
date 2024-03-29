import { Injectable } from '@nestjs/common';
import { IAtlassianConfig } from './interfaces/config-atlassian.model';

@Injectable()
export class ConfigService {
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  private ATLASSIAN_CALLBACK_URL: string;
  private ATLASSIAN_BASE_URL: string;

  public constructor() {
    this.CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID ?? '';
    this.CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET ?? '';
    this.ATLASSIAN_CALLBACK_URL = process.env.ATLASSIAN_CALLBACK_URL ?? '';
    this.ATLASSIAN_BASE_URL = process.env.ATLASSIAN_BASE_URL ?? '';
  }

  public getAtlassian(): IAtlassianConfig {
    return {
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      callbackUrl: this.ATLASSIAN_CALLBACK_URL,
      atlassianBaseUrl: this.ATLASSIAN_BASE_URL,
    };
  }
}
