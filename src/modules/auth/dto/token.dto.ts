import { User } from '../entities/auth.entity';

export interface TokenInfo extends User {
    exp: number;
    iat: number;
}
