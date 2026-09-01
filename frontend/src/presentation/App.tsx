import { useState } from 'react';
import { AppShell } from './components/AppShell';
import { useAuth } from './auth/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

export function App() {
  const { session } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (session) {
    return <AppShell />;
  }

  if (!showLogin) {
    return <LandingPage onEnter={() => setShowLogin(true)} />;
  }

  return <LoginPage />;
}
