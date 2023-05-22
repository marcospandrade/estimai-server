import { Injectable } from '@nestjs/common';
// import { Strategy } from "passport-strategy";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class JiraStrategy extends PassportStrategy(Strategy, 'jira') {
  public constructor() {
    super({
      authorizationURL: 'https://auth.atlassian.com/authorize',
      tokenURL: 'https://auth.atlassian.com/oauth/token',
      clientID: process.env.JIRA_CLIENT_ID,
      clientSecret: process.env.JIRA_CLIENT_SECRET,
      callbackURL: process.env.JIRA_CALLBACK_URL,
      scope: 'read:jira-user',
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('profile', profile);
    return { accessToken, refreshToken };
  }
}
