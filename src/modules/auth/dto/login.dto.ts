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
  picture?: string;
  jobTitle?: string;
}
