export enum UserRole {
  INSPECTOR = 'inspector',
  MANAGER = 'manager',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
