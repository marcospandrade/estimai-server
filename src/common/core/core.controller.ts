import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

// import { BaseAppConfig } from '../config/config.module';
import { CoreService, HealthIndicatorInterface } from './core.service';

@Controller({ version: VERSION_NEUTRAL })
export class CoreController {
    constructor(
        private readonly healthService: HealthCheckService,
        // private readonly configService: ConfigService<BaseAppConfig>,
        private moduleRef: ModuleRef,
    ) {}

    @Get('health-check')
    @HealthCheck()
    check() {
        const healthCheckItems = CoreService.customHealthIndicators.map(indicatorClass => {
            return () => {
                const indicator: HealthIndicatorInterface = this.moduleRef.get(indicatorClass, {
                    strict: false,
                });
                const result = indicator.isHealthy();
                return result;
            };
        });
        return this.healthService.check([...healthCheckItems]);
    }

    // @Get('version')
    // version() {
    //     return {
    //         version: this.configService.getOrThrow('BUILD_COMMIT_HASH', {
    //             infer: true,
    //         }),
    //         date: this.configService.getOrThrow('BUILD_DATE', {
    //             infer: true,
    //         }),
    //     };
    // }
}
