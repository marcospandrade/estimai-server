import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './current-user.middleware';
import { IUser } from '@modules/auth/entities/user.entity';

/**
 * A decorator to make accessing the current user easier
 * Uses the user object set by the CurrentUserMiddleware on the Request
 *
 * @example
 *
 * //For a route in a controller
 * \@Get()
 * async get(@CurrentUser() user: User) {
 *    return user;
 * }
 */
export const CurrentUser = createParamDecorator<unknown, ExecutionContext, IUser>((data, ctx) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
});
