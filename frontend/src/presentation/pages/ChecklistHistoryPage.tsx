import { useEffect, useMemo, useState } from 'react';
import type { Checklist } from '../../domain/checklist/checklist';
import { ListChecklistsUseCase } from '../../application/checklist/list-checklists.use-case';
import { DownloadChecklistPdfUseCase } from '../../application/checklist/download-checklist-pdf.use-case';
import { HttpChecklistRepository } from '../../infrastructure/checklist/http-checklist-repository';
import { useAuth } from '../auth/AuthContext';

export function ChecklistHistoryPage() {
  const { session } = useAuth();
  const repository = useMemo(() => new HttpChecklistRepository(session!.accessToken), [session]);
  const listChecklists = useMemo(() => new ListChecklistsUseCase(repository), [repository]);
  const downloadPdf = useMemo(() => new DownloadChecklistPdfUseCase(repository), [repository]);

  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [plateFilter, setPlateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load(vehiclePlate?: string) {
    setLoading(true);
    setError(null);
    listChecklists
      .execute({ vehiclePlate: vehiclePlate || undefined })
      .then(setChecklists)
      .catch(() => setError('Não foi possível carregar o histórico.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDownloadPdf(checklistId: string) {
    const blob = await downloadPdf.execute(checklistId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-${checklistId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <h2>Histórico de checklists</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Filtrar por placa"
          value={plateFilter}
          onChange={(event) => setPlateFilter(event.target.value)}
        />
        <button type="button" onClick={() => load(plateFilter)} style={{ marginLeft: '0.5rem' }}>
          Filtrar
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      {loading && <p>Carregando...</p>}

      {!loading && checklists.length === 0 && <p>Nenhum checklist encontrado.</p>}

      {!loading && checklists.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
              <th>Data</th>
              <th>Placa</th>
              <th>Motorista</th>
              <th>ONU</th>
              <th>Inspetor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((checklist) => (
              <tr key={checklist.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{new Date(checklist.createdAt).toLocaleString('pt-BR')}</td>
                <td>{checklist.vehiclePlate}</td>
                <td>{checklist.driverName}</td>
                <td>{checklist.unNumber}</td>
                <td>{checklist.inspectorName}</td>
                <td style={{ color: checklist.status === 'compliant' ? 'green' : 'crimson' }}>
                  {checklist.status === 'compliant' ? 'CONFORME' : 'NÃO CONFORME'}
                </td>
                <td>
                  <button type="button" onClick={() => handleDownloadPdf(checklist.id)}>
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
