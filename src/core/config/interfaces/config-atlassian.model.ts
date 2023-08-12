export type GrantType = 'authorization_code' | 'refresh_token';

export interface IAuthConfigAtlassian {
  grant_type: GrantType;
  client_id: string;
  client_secret: string;
}
export interface IExchangeCodeToAccessTokenAtlassian
  extends IAuthConfigAtlassian {
  code: string;
  redirect_uri: string;
}

export interface IRefreshTokenAtlassian extends IAuthConfigAtlassian {
  refresh_token: string;
}

export interface IAtlassianConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}
