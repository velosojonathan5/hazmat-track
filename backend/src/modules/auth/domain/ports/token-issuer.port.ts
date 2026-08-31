import type { UserRole } from '../entities/user.entity.js';

export const TOKEN_ISSUER_PORT = Symbol('TOKEN_ISSUER_PORT');

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface TokenIssuer {
  sign(payload: AuthTokenPayload): string;
}
