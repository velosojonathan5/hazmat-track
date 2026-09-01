import type { AuthRepository } from '../../domain/auth/auth-repository.port';
import type { AuthSession } from '../../domain/auth/auth-session';
import { apiPost } from '../http/api-client';

export class HttpAuthRepository implements AuthRepository {
  login(email: string, password: string): Promise<AuthSession> {
    return apiPost<AuthSession>('/auth/login', { email, password });
  }
}
