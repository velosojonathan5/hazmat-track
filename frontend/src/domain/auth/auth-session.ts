import type { AuthenticatedUser } from './user';

export interface AuthSession {
  accessToken: string;
  user: AuthenticatedUser;
}
