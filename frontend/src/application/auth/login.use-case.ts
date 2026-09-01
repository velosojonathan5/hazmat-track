import type { AuthRepository } from '../../domain/auth/auth-repository.port';
import type { AuthSession } from '../../domain/auth/auth-session';

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(email: string, password: string): Promise<AuthSession> {
    return this.authRepository.login(email, password);
  }
}
