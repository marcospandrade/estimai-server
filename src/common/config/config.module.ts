import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { IntersectionType } from '@nestjs/mapped-types';
import { BaseLoggerConfig } from '../logger/logger.options';
import { MaybePromise } from '../utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CoreModule } from './../core/core.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoggerModule } from './../logger/logger.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { ObjValidator } from './obj-validator';

import { BaseCustomConfig } from './sources/custom.config';
import { BaseEnvConfig } from './sources/env.config';

import path from 'path';
import { AtlassianConfig } from './sources/atlassian.config';

/**
 * BaseAppConfig covers all the config values for modules which are required for all apps
 * Those modules are:
 *
 * {@link ConfigModule}
 *
 * {@link CoreModule}
 *
 * {@link LoggerModule}
 *
 * {@link SqsModule} - Used to subscribe to user updates to invalidate stored user
 */
export class BaseAppConfig extends IntersectionType(
    BaseEnvConfig,
    BaseCustomConfig,
    BaseLoggerConfig,
    AtlassianConfig,
) {}

interface ConfigOptions {
    /**
     *  A general purpose function allowing any additional configuration to be added that isn't
     *  possible through the other available ConfigOptions helpers.
     *  The return type of your customLoad should be added to the AppConfig interface
     *
     * @example
     *  export class ExampleAppConfig extends IntersectionType(
     *      BaseAppConfig,
     *      ExampleCustomConfig, // <-- this is the return type of customLoad
     *  ) {}
     */
    customLoad?: () => MaybePromise<Record<string, unknown>>;

    /**
     * The full interface of config values that you wish to use for configService.get()
     * ConfigModule will perform runtime checks to ensure that it is hydrated correctly.
     *
     * @example
     *  export class ExampleAppConfig extends IntersectionType(
     *      BaseAppConfig,
     *      BasePrismaConfig,
     *  ) { someAppVar: string }
     *  ...
     *  ConfigModule.registerAsync({ AppConfig: ExampleAppConfig }),
     */
    AppConfig: typeof BaseAppConfig;
}

/**
 * ConfigModule is a wrapper around Nest's ConfigModule which allows you to initialize
 * the Environment-specific variables for your app.
 *
 * Only variables that are Environment-specific should be added here. For other constants
 * consider importing directly from the file they're declared in.
 *
 * You'll want to compose the config classes from the other modules you use to create the
 * full Config class for your app. This is passed to AppConfig in {@link ConfigOptions}
 *
 *  We want our config to be available to other modules in the following form:
 *
 *  @example
 *  constructor(private readonly configService: ConfigService<ExampleAppConfig>) {
 *      const dbUser = this.configService.get('DATABASE_URL', { infer: true });
 *  }
 */
@Module({})
export class ConfigModule {
    static async registerAsync(options: ConfigOptions): Promise<DynamicModule> {
        const { customLoad, AppConfig } = options;

        async function getCustomConfig() {
            const config = await customLoad?.();
            const baseConfig: BaseCustomConfig = {
                serverStartTime: Date.now(),
            };
            return {
                ...baseConfig,
                ...config,
            };
        }
        // Resolve any custom load function
        const customConfig = await getCustomConfig();

        const validate = (config: Record<string, unknown>) => {
            return ObjValidator.forCustom(AppConfig, {
                // this validated that customConfig adheres to the AppConfig interface
                ...customConfig,
                ...config,
            });
        };

        return {
            global: true,
            module: ConfigModule,
            imports: [
                NestConfigModule.forRoot({
                    validate: validate,
                    isGlobal: true,
                    // this actually adds the customConfig to the configService
                    load: [() => customConfig],
                }),
            ],
            providers: [ConfigService],
            exports: [ConfigService],
        };
    }
}
