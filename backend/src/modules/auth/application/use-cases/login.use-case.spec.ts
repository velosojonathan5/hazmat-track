import { UnauthorizedException } from '@nestjs/common';
import { UserRole, type User } from '../../domain/entities/user.entity.js';
import type { PasswordHasher } from '../../domain/ports/password-hasher.port.js';
import type { TokenIssuer } from '../../domain/ports/token-issuer.port.js';
import type { UserRepository } from '../../domain/ports/user-repository.port.js';
import { LoginUseCase } from './login.use-case.js';

const demoUser: User = {
  id: 'user-1',
  name: 'Demo Inspector',
  email: 'inspector@hazmattrack.demo',
  passwordHash: 'hashed-password',
  role: UserRole.INSPECTOR,
};

function buildUseCase(overrides: { passwordMatches?: boolean; userFound?: User | null } = {}) {
  const userRepository: UserRepository = {
    findByEmail: async () => (overrides.userFound === undefined ? demoUser : overrides.userFound),
    findById: async () => demoUser,
  };
  const passwordHasher: PasswordHasher = {
    compare: async () => overrides.passwordMatches ?? true,
  };
  const tokenIssuer: TokenIssuer = {
    sign: () => 'signed-jwt-token',
  };

  return new LoginUseCase(userRepository, passwordHasher, tokenIssuer);
}

describe('LoginUseCase', () => {
  it('returns an access token and the user data on valid credentials', async () => {
    const useCase = buildUseCase();

    const result = await useCase.execute(demoUser.email, 'correct-password');

    expect(result.accessToken).toBe('signed-jwt-token');
    expect(result.user).toEqual({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
    });
  });

  it('throws UnauthorizedException when the user does not exist', async () => {
    const useCase = buildUseCase({ userFound: null });

    await expect(useCase.execute('unknown@hazmattrack.demo', 'any-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the password does not match', async () => {
    const useCase = buildUseCase({ passwordMatches: false });

    await expect(useCase.execute(demoUser.email, 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
