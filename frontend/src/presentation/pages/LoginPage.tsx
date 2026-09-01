import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('inspector@hazmattrack.demo');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="centered-shell">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 'var(--space-5)' }}>
          <span className="brand-mark">HT</span>
          <h1>HazmatTrack</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="stack">
            <div className="field">
              <label className="field-label" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-error">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="login-hint">
          Demo: inspector@hazmattrack.demo / inspector123 ou manager@hazmattrack.demo / manager123
        </p>
      </div>
    </main>
  );
}
