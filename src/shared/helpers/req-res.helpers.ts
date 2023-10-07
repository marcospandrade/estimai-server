import { AxiosError } from 'axios';
import { map } from 'rxjs';
import { User } from 'src/modules/auth/entities/auth.entity';

export interface RequestWithUser {
  user: User;
}

export interface GenericHttpResponse<T> {
  response: T;
  message: string;
}

export class IntegrationError extends Error {
  integrationError?: Error | AxiosError;

  constructor(message: string, integrationError?: Error | AxiosError) {
    super(message);
    this.integrationError = integrationError;
  }
}

export function mountGenericResponse<T>(data: T, message: string): GenericHttpResponse<T> {
  return {
    response: data,
    message,
  };
}

export function mountAxiosGenericResponse<T>(message: string) {
  return map((data: T) => {
    return mountGenericResponse<T>(data, message);
  });
}
