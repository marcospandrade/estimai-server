export interface IAuth {
  code: string;
  state: string;
}

export interface ICreateUserDTO {
  state: string;
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  name: string;
  email: string;
  picture?: string;
  jobTitle?: string;
}
