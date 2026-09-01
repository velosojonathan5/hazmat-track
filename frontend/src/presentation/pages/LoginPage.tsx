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
    <main style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h1>HazmatTrack</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <label htmlFor="password">Senha</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} style={{ marginTop: '1rem' }}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'gray' }}>
        Demo: inspector@hazmattrack.demo / inspector123 ou manager@hazmattrack.demo / manager123
      </p>
    </main>
  );
}
