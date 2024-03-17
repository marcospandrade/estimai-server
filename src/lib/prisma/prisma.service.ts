import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    public constructor() {
        super({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    public async onModuleInit() {
        await this.$connect();
        // this.$on('query', e => {
        //     console.log('Query: ' + e.query);
        //     console.log('Params: ' + e.params);
        //     console.log('Duration: ' + e.duration + 'ms');
        // });
    }

    public async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
