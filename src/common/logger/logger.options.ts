import { Transform } from 'class-transformer';
import { Response } from 'express';
import { Params } from 'nestjs-pino';
import { ObjValidator } from '../config/obj-validator';
import { BaseEnvConfig } from '../config/sources/env.config';
import { RequestWithUser } from '../current-user/current-user.middleware';
import * as crypto from 'crypto';

export enum LogLevel {
    TRACE = 'trace',
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    SILENT = 'silent',
}
export class BaseLoggerConfig extends BaseEnvConfig {
    @Transform(({ value }) => !!value)
    LOGGER_PRETTY_PRINT?: boolean;
}

const genOrCreateReqId = (req: any) => {
    return req.headers['x-request-id'] || req.id || crypto.randomUUID();
};

export function getDefaultParams(): Params {
    const { APP_NAME, LOGGER_PRETTY_PRINT } = ObjValidator.forEnv(BaseLoggerConfig);
    return {
        pinoHttp: {
            name: APP_NAME,
            transport: LOGGER_PRETTY_PRINT
                ? {
                      targets: [
                          {
                              target: 'pino-pretty',
                              options: {
                                  colorize: true,
                                  ignore: 'context,hostname,pid,name',
                              },
                              level: LogLevel.DEBUG,
                          },
                      ],
                  }
                : undefined,
            serializers: {
                req: (req: RequestWithUser) => {
                    if (LOGGER_PRETTY_PRINT) return;
                    return {
                        method: req.method,
                        userId: req.user?.id,
                        url: req.url,
                        requestId: req.id,
                    };
                },

                res: (res: Response) => {
                    if (!res.statusCode) return undefined;
                    return {
                        statusCode: res.statusCode,
                    };
                },
            },
            // Define a custom logger level
            customLogLevel: function (_req, res) {
                if (res.statusCode >= 400) {
                    return LogLevel.SILENT;
                }
                return LogLevel.INFO;
            },
            customAttributeKeys: {
                req: 'request',
                res: 'response',
                err: 'error',
            },
            genReqId: (req, res) => {
                const requestId = genOrCreateReqId(req);

                res.setHeader('x-request-id', requestId);

                return requestId;
            },
        },
    };
}
