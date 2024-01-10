import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenInfo } from './dto/token.dto';
import { AuthFactoryService } from './use-cases/auth-factory.service';
import { ConfigService } from '@nestjs/config';
import { EstimAiConfig } from 'src/app.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly authFactory: AuthFactoryService,
    private readonly configService: ConfigService<EstimAiConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: TokenInfo) {
    const user = await this.authFactory.checkUserExists(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
