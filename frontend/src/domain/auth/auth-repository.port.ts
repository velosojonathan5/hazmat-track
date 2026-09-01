import type { AuthSession } from './auth-session';

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthSession>;
}
