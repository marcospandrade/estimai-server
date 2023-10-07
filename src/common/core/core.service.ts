import { Injectable } from '@nestjs/common';
import {
  GlobalPrefixOptions,
  INestApplication,
  NestApplicationOptions,
  VersioningOptions,
} from '@nestjs/common/interfaces';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet, { HelmetOptions } from 'helmet';
import hpp from 'hpp';
import { Logger } from 'nestjs-pino';
import { ObjValidator } from '../config/obj-validator';
import { BaseEnvConfig } from '../config/sources/env.config';

import { MaybePromise } from '../utils';
import { HealthIndicatorResult } from '@nestjs/terminus';
export { HealthIndicator, HealthCheckError } from '@nestjs/terminus';

export interface HealthIndicatorInterface {
  isHealthy(key?: string): Promise<HealthIndicatorResult>;
}

export interface CoreModuleOptions {
  /**
   * @property appModule - Entry (root) application module class.
   * @example  AppModule
   */
  appModule: any;
  /**
   * @property appOptions - Optional application options.
   * @example { rawBody: true }
   */
  appOptions?: NestApplicationOptions;
  /**
   * @example () => console.log('Before app create')
   * @example async () => await new Promise((resolve) => setTimeout(resolve, 1000))
   */
  beforeAppCreate?: () => MaybePromise<void>;
  /**
   * @example (app) => console.log('After app create')
   * @example async () => await new Promise((resolve) => setTimeout(resolve, 1000))
   */
  afterAppCreate?: (app: INestApplication) => MaybePromise<void>;
  /**
   * @example app.useGlobalFilters(new ExceptionFilter())
   */
  globalFilters?: Parameters<INestApplication['useGlobalFilters']>;
  /**
   * @example app.useGlobalInterceptors(new TransformInterceptor())
   */
  globalInterceptors?: Parameters<INestApplication['useGlobalInterceptors']>;
  /**
   * @example app.useGlobalPipes(new ValidationPipe())
   */
  globalPipes?: Parameters<INestApplication['useGlobalPipes']>;
  /**
   * @param prefix — The prefix for every HTTP route path.
   * @example 'api'
   * @param prefixOptions - Optional options for the global prefix.
   * @example { exclude: ['health-check', 'version'] }
   */
  globalPrefix?: {
    prefix: string;
    prefixOptions?: GlobalPrefixOptions;
  };
  /**
   * @property helmetOptions - Optional security-related HTTP headers options.
   * @example { contentSecurityPolicy: false }
   */
  helmetOptions?: Readonly<HelmetOptions>;
  /**
   *  @example [logger]
   */
  middlewares?: any[];
  /**
   * @property configureDocumentBuilder - Function to configure the Swagger document builder.
   * @example (documentBuilder) => documentBuilder.setTitle('Example').setVersion('1.0')
   * @property path - Path where Swagger UI will be hosted.
   * @example 'api/docs'
   */
  swaggerOptions?: {
    configureDocumentBuilder: (documentBuilder: DocumentBuilder) => DocumentBuilder;
    path: string;
  };
  /**
   * @property versioningOptions - Optional versioning options.
   * @example { type: VersioningType.URI, defaultVersion: '0' }
   */
  versioningOptions?: VersioningOptions;

  /**
   * @property customHealthIndicators - Optional custom health indicators to be used by Terminus.
   * @example [TodosHealthIndicator]
   */
  customHealthIndicators?: any[];
  /**
   * @property useRedis - Enable/disable Redis microservice, if you import the CacheModule or RedisModule you need this.
   */
  useRedisPubSub: boolean;
}

@Injectable()
export class CoreService {
  static customHealthIndicators: any[] = [];
  static async bootstrap(options: CoreModuleOptions) {
    // Validate environment variables
    const { NODE_ENV, APP_PORT } = ObjValidator.forEnv(BaseEnvConfig);

    // Call beforeAppCreateAsync hook
    await options.beforeAppCreate?.();

    // Create NestJS application
    const app = await NestFactory.create(options.appModule, options.appOptions);
    // Apply Pino logger to NestJS build-in logger
    app.useLogger(app.get(Logger));

    // Apply helmet middleware
    app.use(helmet(options.helmetOptions));

    // Apply hpp middleware
    app.use(hpp());

    // Set up global prefix
    if (options.globalPrefix) {
      const { prefix, prefixOptions } = options.globalPrefix;
      app.setGlobalPrefix(prefix, prefixOptions);
    }

    // TODO: Enable versioning?
    // Enable versioning before Swagger
    // app.enableVersioning(options.versioningOptions);

    // Set up Swagger in all environments except production
    if (NODE_ENV !== 'prod' && options.swaggerOptions) {
      const config = options.swaggerOptions.configureDocumentBuilder(new DocumentBuilder()).build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(options.swaggerOptions.path, app, document);
    }

    // Apply middlewares
    if (options.middlewares) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      app.use(...options.middlewares);
    }

    if (options.globalInterceptors) {
      app.useGlobalInterceptors(...options.globalInterceptors);
    }

    if (options.globalPipes) {
      app.useGlobalPipes(...options.globalPipes);
    }

    // Apply global filters to catch all exceptions not handled by the application
    // these will override the APP_FILTER providers
    if (options.globalFilters) {
      app.useGlobalFilters(...options.globalFilters);
    }

    // Call afterAppCreateAsync hook
    await options.afterAppCreate?.(app);

    if (options.customHealthIndicators) {
      CoreService.customHealthIndicators = options.customHealthIndicators;
    }

    app.enableShutdownHooks();
    // Configure port and start listening

    await app.startAllMicroservices();

    await app.listen(APP_PORT || 3000);
  }
}
