import { Request } from 'express';
import { IUser } from 'src/modules/auth/entities/user.entity';

export type NewRequest = Request & { user: IUser };
