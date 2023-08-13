export interface IAuth {
  code: string;
  state: string;
}

export interface ICreateUserDTO {
  state: string;
  accessToken: string;
  refreshToken: string;
  name: string;
  email?: string;
  picture?: string;
  jobTitle?: string;
}
