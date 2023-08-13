import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ICreateUserDTO } from '../dto/register.dto';
import { IAtlassianAuth } from 'src/core/config/interfaces/config-atlassian.model';
@Injectable()
export class AuthFactoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createUser(payload: ICreateUserDTO) {
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

  public async getAtlassianAccessToken(
    userId: string,
  ): Promise<IAtlassianAuth> {
    const authData = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        accessToken: true,
        refreshToken: true,
      },
    });

    if (!authData) {
      throw new NotFoundException('Client not registered');
    }

    return authData;
  }
}
