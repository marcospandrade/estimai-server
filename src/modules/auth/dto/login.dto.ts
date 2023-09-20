export interface IAuth {
  code: string;
  state: string;
}

export interface ICreateUserDTO {
  state: string;
  accessTokenEstimai: string;
  accessTokenAtlassian: string;
  expiresAt: string;
  refreshToken: string;
  name: string;
  email: string;
  urlAuthenticated: string;
  cloudId: string;
  picture?: string;
  jobTitle?: string;
}
