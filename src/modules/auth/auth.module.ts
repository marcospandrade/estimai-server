import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';
import { EstimAiConfig } from 'src/app.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PrismaModule,
        HttpModule,
        AtlassianModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService<EstimAiConfig>) => {
                const secret = configService.get('JWT_KEY');
                const expiresIn = configService.get('JWT_EXPIRES');

                return {
                    secret,
                    signOptions: {
                        expiresIn,
                    },
                };
            },
            inject: [ConfigService],
        }),
        PassportModule.registerAsync({
            useFactory: () => {
                return {
                    defaultStrategy: 'jwt',
                    property: 'user',
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthUseCase, AuthFactoryService, JwtService, ConfigService],
    exports: [AuthUseCase, JwtService],
})
export class AuthModule {}
