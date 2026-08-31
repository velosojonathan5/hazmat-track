import { GetSystemHealthUseCase } from './get-system-health.use-case.js';
import type { DatabasePingPort } from '../../domain/ports/database-ping.port.js';

describe('GetSystemHealthUseCase', () => {
  it('retorna status "ok" quando o banco responde', async () => {
    const fakePing: DatabasePingPort = { ping: async () => true };
    const useCase = new GetSystemHealthUseCase(fakePing);

    const result = await useCase.execute();

    expect(result.status).toBe('ok');
    expect(result.database).toBe(true);
  });

  it('retorna status "degraded" quando o banco falha', async () => {
    const fakePing: DatabasePingPort = { ping: async () => false };
    const useCase = new GetSystemHealthUseCase(fakePing);

    const result = await useCase.execute();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe(false);
  });
});
