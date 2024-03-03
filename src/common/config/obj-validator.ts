import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

/**
 * *Only use if unable to access injected ConfigService*
 *
 * This helper class can be used for runtime validation of config objects, mainly process.env
 */
export class ObjValidator {
    /**
     *  *Only use if unable to access injected ConfigService*
     *
     * This helper will hydrate and validate a class based off the config object passed in
     *
     * @example
     * ```ts
     *  class BasePrismaConfig {
     *     \@IsString()
     *     DATABASE_URL: string;
     *  }
     *  const config = { DATABASE_URL: 'my-conn-str' };
     *  const prismaCustomConfig = Validator.forCustom(BasePrismaConfig, config));
     *  prismaCustomConfig.DATABASE_URL; // contains string
     * ```
     */
    static forCustom<T extends object>(ConfigClass: ClassConstructor<T>, config: Record<string, unknown>) {
        const moduleEnvConfig = plainToClass(ConfigClass, config, {
            enableImplicitConversion: true,
        });
        const errors = validateSync(moduleEnvConfig, {
            skipMissingProperties: false,
        });

        if (errors.length > 0) {
            const constraintMsgs = errors.map(e => JSON.stringify(e.constraints)).join('\n');
            throw new Error(`Validation failed! Fix the following errors:\n\n${constraintMsgs}\n\n`);
        }

        return moduleEnvConfig;
    }
    /**
     *  *Only use if unable to access injected ConfigService*
     *
     * This helper will hydrate and validate a class based off values available in process.env
     *
     * @example
     * ```ts
     *  class BasePrismaConfig {
     *     \@IsString()
     *     DATABASE_URL: string;
     *  }
     *  const prismaEnvConfig = Validator.forEnv(IntersectionType(BasePrismaConfig, BaseAppConfig));
     *  prismaEnvConfig.DATABASE_URL; // contains string
     * ```
     */
    static forEnv<T extends object>(ModuleEnvConfig: ClassConstructor<T>) {
        return ObjValidator.forCustom(ModuleEnvConfig, process.env);
    }
}
