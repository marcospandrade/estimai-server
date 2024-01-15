import { Injectable, UnauthorizedException } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianService } from '../../../common/atlassian/atlassian.service';
import { AtlassianHelper } from '../../../common/atlassian/helpers/atlassian.helper';

@Injectable()
export class AuthUseCase {
    public constructor(
        private readonly authFactoryService: AuthFactoryService,
        private readonly atlassianService: AtlassianService,
    ) {}

    public async login(registerDto: IAuth) {
        const bodySchema = z.object({
            code: z.string(),
            state: z.string().uuid(),
        });

        const { code, state } = bodySchema.parse(registerDto);

        const exchangedCode = await this.atlassianService.exchangeCodeToAccessToken(code);

        const userInfo = await this.atlassianService.getUserInformation(exchangedCode.access_token);

        const userExists = await this.authFactoryService.checkUserExists(userInfo.email);

        if (userExists) {
            return userExists;
        }

        const accessibleResources = await this.atlassianService.getAccessibleResources(exchangedCode.access_token);

        const accessTokenEstimai = await this.authFactoryService.generateJwtToken(
            state,
            userInfo,
            accessibleResources.url,
            accessibleResources.id,
        );

        const createUser: ICreateUserDTO = {
            accessTokenEstimai,
            accessTokenAtlassian: exchangedCode.access_token,
            refreshToken: exchangedCode.refresh_token,
            expiresAt: AtlassianHelper.calculateExpiresAt(exchangedCode.expires_in),
            state,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            jobTitle: userInfo.extended_profile.job_title,
            urlAuthenticated: accessibleResources.url,
            cloudId: accessibleResources.id,
        };

        const userCreated = await this.authFactoryService.createUser(createUser);

        return userCreated;
    }

    public async refreshToken(userEmail: string) {
        const user = await this.authFactoryService.checkUserExists(userEmail);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const refreshedToken = await this.atlassianService.refreshToken(userEmail, user.refreshToken);

        return refreshedToken;
    }
}
