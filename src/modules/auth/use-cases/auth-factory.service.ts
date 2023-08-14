import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ICreateUserDTO } from '../dto/login.dto';
import { User } from '@prisma/client';
@Injectable()
export class AuthFactoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async checkUserExists(state: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        state,
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
}
