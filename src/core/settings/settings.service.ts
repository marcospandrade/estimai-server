import { Injectable } from '@nestjs/common';
import { IAtlassianConfig } from '../atlassian/interfaces/config.model';

@Injectable()
export class SettingsService {
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  private ATLASSIAN_CALLBACK_URL: string;

  public constructor() {
    this.CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID ?? '';
    this.CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET ?? '';
    this.ATLASSIAN_CALLBACK_URL = process.env.ATLASSIAN_CALLBACK_URL ?? '';
  }

  public getAtlassian(): IAtlassianConfig {
    return {
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      callbackUrl: this.ATLASSIAN_CALLBACK_URL,
    };
  }
}
