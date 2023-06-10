import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { z } from 'zod';
import { RegisterDto } from './dto/register.dto';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    let user;

    user = await this.prismaService.user.findUnique({
      where: {
        code,
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          code,
        },
      });
    }

    return this.httpService
      .get(
        `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=vES8VVF33u9KEXsb6rerNcl5oy8Ciarm&scope=read%3Aissue%3Ajira%20read%3Afield%3Ajira&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=${state}&response_type=code&prompt=consent`,
        {
          headers: {
            Authorization: `Bearer ${user.code}`,
          },
        },
      )
      .subscribe();
  }
}
