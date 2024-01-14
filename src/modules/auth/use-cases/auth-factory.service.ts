import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ICreateUserDTO } from '../dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserAtlassianInfo } from 'src/common/atlassian/interfaces/user-info.model';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthFactoryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    public async checkUserExists(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    public async createUser(payload: ICreateUserDTO): Promise<User> {
        const user = await this.prismaService.user.upsert({
            where: {
                state: payload.state,
            },
            update: {
                ...payload,
            },
            create: {
                ...payload,
            },
        });

        return user;
    }

    public async generateJwtToken(
        state: string,
        userInfo: UserAtlassianInfo,
        urlAuthenticated: string,
        cloudId: string,
    ): Promise<string> {
        // NOTE: Check later if it's necessary to add more information to the token, like (atlassian access token and refresh_token)
        const payload = {
            state: state,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            jobTitle: userInfo.extended_profile.job_title,
            urlAuthenticated,
            cloudId,
        };

        return this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_KEY') });
    }
}
