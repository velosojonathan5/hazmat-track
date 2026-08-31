import { useEffect, useState } from 'react';
import { GetHealthStatusUseCase } from '../../application/health/get-health-status.use-case';
import { HttpHealthRepository } from '../../infrastructure/health/http-health-repository';
import type { HealthStatus } from '../../domain/health/health-status';

const getHealthStatus = new GetHealthStatusUseCase(new HttpHealthRepository());

export function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealthStatus
      .execute()
      .then(setHealth)
      .catch(() => setError('Não foi possível conectar à API.'));
  }, []);

  return (
    <main>
      <h1>HazmatTrack</h1>
      <p>POC — status de conexão com a API e o banco de dados.</p>

      {error && <p role="alert">{error}</p>}

      {!error && !health && <p>Verificando conexão com a API...</p>}

      {health && (
        <dl>
          <dt>Status da API</dt>
          <dd>{health.status}</dd>
          <dt>Banco de dados</dt>
          <dd>{health.database ? 'conectado' : 'indisponível'}</dd>
          <dt>Última verificação</dt>
          <dd>{new Date(health.timestamp).toLocaleString('pt-BR')}</dd>
        </dl>
      )}
    </main>
  );
}
