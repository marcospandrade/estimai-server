import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { TokenInfo } from '../../dto/token.dto';
import { RequestWithUser } from 'src/common/current-user/current-user.middleware';
import { EstimAiConfig } from 'src/app.module';

/**
 * @description JWT Authentication Guard
 *
 * Use in conjunction with {@link Roles} decorator to set the allowed roles of a route
 *
 * If no {@link RouteRoles} are passed, the route will default to JWT authentication only
 *
 * @example
 * _@Controller('contacts')
 * _@UseGuards(JwtAuthGuard)
 * export class ContactsController {
 * ...
 *
 * _@Post('/assert-consistency')
 * _@Roles(['baileys'])
 * assertConsistency(@Body() payload: UpdateContactDto) {
 *   return this.contactsService.assertConsistency(payload);
 * }
 * ...
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
    constructor(private reflector: Reflector, private configService: ConfigService<EstimAiConfig>) {
        super();
    }

    public handleRequest(err: unknown, user: TokenInfo): any {
        return user;
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request: RequestWithUser = context.switchToHttp().getRequest();

        const user = request.user;

        // const roles: RouteRoles = this.reflector.get(Roles, context.getHandler()) ?? [];

        // if (roles.includes('anonymous')) {
        //     return true;
        // }

        if (!user) {
            return false;
        }

        // const hasRole = roles.includes(user.role) || user.role === UserRolesEnum.ADMIN;

        // return !!user && hasRole;
        return !!user;
    }
}
