import * as bcrypt from 'bcryptjs';

export class AuthHelpers {
    static isPasswordValid(userPassword: string, payloadPassword: string): boolean {
        return bcrypt.compareSync(userPassword, payloadPassword);
    }
}
