import { Request } from 'express';

import { User } from 'src/modules/auth/entities/auth.entity';

export type RequestUser = Request & { user: User };
