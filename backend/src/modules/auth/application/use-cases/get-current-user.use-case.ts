import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity.js';
import { USER_REPOSITORY_PORT, type UserRepository } from '../../domain/ports/user-repository.port.js';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }
}
