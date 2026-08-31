import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { PasswordHasher } from '../../domain/ports/password-hasher.port.js';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
