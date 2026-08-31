import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRole } from '../../domain/entities/user.entity.js';
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasher,
} from '../../domain/ports/password-hasher.port.js';
import { TOKEN_ISSUER_PORT, type TokenIssuer } from '../../domain/ports/token-issuer.port.js';
import { USER_REPOSITORY_PORT, type UserRepository } from '../../domain/ports/user-repository.port.js';

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_ISSUER_PORT) private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.passwordHasher.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenIssuer.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
