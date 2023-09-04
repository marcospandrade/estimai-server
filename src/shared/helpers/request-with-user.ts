import { User } from 'src/modules/auth/entities/auth.entity';

export interface RequestWithUser {
  user: User;
}
