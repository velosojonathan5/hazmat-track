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
    <div className="stack">
      <div className="row-between">
        <h2>Histórico de checklists</h2>
        <div className="row">
          <input placeholder="Filtrar por placa" value={plateFilter} onChange={(event) => setPlateFilter(event.target.value)} />
          <button type="button" className="btn btn-secondary" onClick={() => load(plateFilter)}>
            Filtrar
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}

      {loading && <p>Carregando...</p>}

      <div className="card" style={{ padding: 0 }}>
        {!loading && checklists.length === 0 && (
          <p style={{ padding: 'var(--space-5)' }}>Nenhum checklist encontrado.</p>
        )}

        {!loading && checklists.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
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
                  <tr key={checklist.id}>
                    <td>{new Date(checklist.createdAt).toLocaleString('pt-BR')}</td>
                    <td>{checklist.vehiclePlate}</td>
                    <td>{checklist.driverName}</td>
                    <td>{checklist.unNumber}</td>
                    <td>{checklist.inspectorName}</td>
                    <td>
                      <span className={`badge ${checklist.status === 'compliant' ? 'badge-good' : 'badge-critical'}`}>
                        {checklist.status === 'compliant' ? 'Conforme' : 'Não conforme'}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDownloadPdf(checklist.id)}>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
