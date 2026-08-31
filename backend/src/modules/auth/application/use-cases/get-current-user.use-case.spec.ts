import { UnauthorizedException } from '@nestjs/common';
import { UserRole, type User } from '../../domain/entities/user.entity.js';
import type { UserRepository } from '../../domain/ports/user-repository.port.js';
import { GetCurrentUserUseCase } from './get-current-user.use-case.js';

const demoUser: User = {
  id: 'user-1',
  name: 'Demo Manager',
  email: 'manager@hazmattrack.demo',
  passwordHash: 'hashed-password',
  role: UserRole.MANAGER,
};

describe('GetCurrentUserUseCase', () => {
  it('returns the user when found', async () => {
    const userRepository: UserRepository = {
      findByEmail: async () => demoUser,
      findById: async () => demoUser,
    };
    const useCase = new GetCurrentUserUseCase(userRepository);

    const result = await useCase.execute(demoUser.id);

    expect(result).toEqual(demoUser);
  });

  it('throws UnauthorizedException when the user no longer exists', async () => {
    const userRepository: UserRepository = {
      findByEmail: async () => null,
      findById: async () => null,
    };
    const useCase = new GetCurrentUserUseCase(userRepository);

    await expect(useCase.execute('missing-id')).rejects.toThrow(UnauthorizedException);
  });
});
