import helmet from 'helmet';

import { ValidationPipe, VersioningType } from '@nestjs/common';

import { CoreService } from '@common/core/core.service';
import { AppModule } from './app.module';
import { ValidationFailedException } from '@common/core/exceptions/validation-failed-exception';

CoreService.bootstrap({
    globalPrefix: {
        prefix: 'api',
        prefixOptions: {
            exclude: ['health-check', 'version'],
        },
    },

    appModule: AppModule,

    appOptions: {
        bufferLogs: true,
    },

    versioningOptions: {
        type: VersioningType.URI,
        defaultVersion: '0',
    },

    middlewares: [helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' })],
    swaggerOptions: {
        path: 'api/docs',
        configureDocumentBuilder: (documentBuilder) => {
            return documentBuilder
                .setTitle('API Documentation')
                .setDescription('EstimAI API')
                .setVersion('0.0.1')
                .addBearerAuth(
                    {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter JwT Token',
                    },
                    'JWT-auth',
                );
        },
    },
    customHealthIndicators: [],
    useRedisPubSub: false,
    globalPipes: [
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
                exposeUnsetFields: false,
            },
            exceptionFactory(errors) {
                return new ValidationFailedException({
                    validationErrors: errors,
                });
            },
        }),
    ],

    helmetOptions: {
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ['http://localhost:3000'],
                baseUri: ["'self'"],
                blockAllMixedContent: [],
                fontSrc: ["'self'", 'data:'],
                formAction: ["'self'"],
                objectSrc: ["'none'"],

                // requireTrustedTypesFor: ["'script'"], // Prevents DOM XSS injection, but it also breaks the client
                scriptSrcAttr: ["'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                upgradeInsecureRequests: [],
                imgSrc: ["'self'", 'https: data:'],

                // requireTrustedTypesFor: ["'script'"], // Prevents DOM XSS injection, but it also breaks the client
                scriptSrc: ["'self'", "'unsafe-inline'"],
            },
            reportOnly: false,
        },
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
        permittedCrossDomainPolicies: {
            permittedPolicies: 'by-content-type',
        },
    },
});
