import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../helpers/req-res.helpers';
import { User } from 'src/modules/auth/entities/auth.entity';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();

  return data ? request.user[data] : request.user;
});
