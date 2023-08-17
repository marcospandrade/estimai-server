export interface IAuth {
  code: string;
  state: string;
}

export interface ICreateUserDTO {
  state: string;
  accessTokenEstimai: string;
  accessTokenAtlassian: string;
  expiresAt: number;
  refreshToken: string;
  name: string;
  email: string;
  picture?: string;
  jobTitle?: string;
}
