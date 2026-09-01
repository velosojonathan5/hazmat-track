import { AppShell } from './components/AppShell';
import { useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';

export function App() {
  const { session } = useAuth();
  return session ? <AppShell /> : <LoginPage />;
}
