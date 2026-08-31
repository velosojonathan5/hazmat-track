export const PASSWORD_HASHER_PORT = Symbol('PASSWORD_HASHER_PORT');

export interface PasswordHasher {
  compare(plainText: string, hash: string): Promise<boolean>;
}
