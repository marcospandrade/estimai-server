import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ICreateUserDTO } from '../dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserAtlassianInfo } from 'src/core/atlassian/interfaces/user-info.model';
@Injectable()
export class AuthFactoryService {
  public constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

  public async checkUserExists(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async createUser(payload: ICreateUserDTO): Promise<User> {
    let user;

    user = await this.prismaService.user.findUnique({
      where: {
        state: payload.state,
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          ...payload,
        },
      });
    }

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

    return this.jwtService.signAsync(payload);
  }
}
