import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../helpers/request-with-user';
import { User } from 'src/modules/auth/entities/auth.entity';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<RequestWithUser>();

  return data ? user[data] : user;
});
