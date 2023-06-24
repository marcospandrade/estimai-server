import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { z } from 'zod';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../auth.service';
import axios from 'axios';
@Injectable()
export class AuthUseCase {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const bodySchema = z.object({
      code: z.string(),
      state: z.string().uuid(),
    });

    const { code, state } = bodySchema.parse(registerDto);

    const user = await this.authService.createUser({ code, state });

    const response = await axios.get(
      `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=vES8VVF33u9KEXsb6rerNcl5oy8Ciarm&scope=read%3Aissue%3Ajira%20read%3Afield%3Ajira&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=${state}&response_type=code&prompt=consent`,
      {
        headers: {
          Authorization: `Bearer ${user.code}`,
        },
      },
    );

    console.log(response.data);
    return response.data;
  }
}
