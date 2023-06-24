import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { AuthUseCase } from './use-cases/auth.use-cases';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthUseCase],
  exports: [AuthService, AuthUseCase],
})
export class AuthModule {}

// https://auth.atlassian.com/authorize?
// audience=api.atlassian.com&
// client_id=vES8VVF33u9KEXsb6rerNcl5oy8Ciarm&
// scope=read%3Ajira-work&
// redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&
// state=${YOUR_USER_BOUND_VALUE}&
// response_type=code&
// prompt=consent

// https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=vES8VVF33u9KEXsb6rerNcl5oy8Ciarm&scope=read%3Aissue%3Ajira%20read%3Afield%3Ajira&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent

// https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=vES8VVF33u9KEXsb6rerNcl5oy8Ciarm&scope=read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent
