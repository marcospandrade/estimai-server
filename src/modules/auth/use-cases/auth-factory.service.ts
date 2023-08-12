import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
@Injectable()
export class AuthFactoryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  public async createUser(payload: RegisterDto) {
    let user;

    user = await this.prismaService.user.findUnique({
      where: {
        state: payload.state,
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          code: payload.code,
          state: payload.state,
        },
      });
    }

    return user;
  }
}
