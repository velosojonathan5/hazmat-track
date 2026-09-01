import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AuthSession } from '../../domain/auth/auth-session';
import { LoginUseCase } from '../../application/auth/login.use-case';
import { HttpAuthRepository } from '../../infrastructure/auth/http-auth-repository';
import { clearSession, loadSession, saveSession } from '../../infrastructure/auth/token-storage';

interface AuthContextValue {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const loginUseCase = new LoginUseCase(new HttpAuthRepository());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: async (email: string, password: string) => {
        const newSession = await loginUseCase.execute(email, password);
        saveSession(newSession);
        setSession(newSession);
      },
      logout: () => {
        clearSession();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
