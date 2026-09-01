import { useEffect, useMemo, useState } from 'react';
import type { DashboardMetrics } from '../../domain/dashboard/dashboard-metrics';
import { CHECKLIST_CATEGORY_LABEL, type ChecklistCategory } from '../../domain/checklist/checklist-item';
import { GetDashboardMetricsUseCase } from '../../application/dashboard/get-dashboard-metrics.use-case';
import { DownloadChecklistPdfUseCase } from '../../application/checklist/download-checklist-pdf.use-case';
import { HttpDashboardRepository } from '../../infrastructure/dashboard/http-dashboard-repository';
import { HttpChecklistRepository } from '../../infrastructure/checklist/http-checklist-repository';
import { useAuth } from '../auth/AuthContext';

const CATEGORY_ORDER: ChecklistCategory[] = ['documentation', 'personnel', 'vehicle', 'equipment', 'cargo'];

function StatTile({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'critical' }) {
  const toneClass = tone === 'good' ? ' is-good' : tone === 'critical' ? ' is-critical' : '';
  return (
    <div className="stat-tile">
      <div className="stat-tile-label">{label}</div>
      <div className={`stat-tile-value${toneClass}`}>{value}</div>
    </div>
  );
}

export function DashboardPage() {
  const { session } = useAuth();
  const dashboardRepository = useMemo(
    () => new HttpDashboardRepository(session!.accessToken),
    [session],
  );
  const checklistRepository = useMemo(
    () => new HttpChecklistRepository(session!.accessToken),
    [session],
  );
  const getMetrics = useMemo(
    () => new GetDashboardMetricsUseCase(dashboardRepository),
    [dashboardRepository],
  );
  const downloadChecklistPdf = useMemo(
    () => new DownloadChecklistPdfUseCase(checklistRepository),
    [checklistRepository],
  );

  const [vehiclePlate, setVehiclePlate] = useState('');
  const [unNumber, setUnNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    getMetrics
      .execute({
        vehiclePlate: vehiclePlate || undefined,
        unNumber: unNumber || undefined,
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
      })
      .then(setMetrics)
      .catch(() => setError('Não foi possível carregar os indicadores.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDownloadChecklistPdf(checklistId: string) {
    const blob = await downloadChecklistPdf.execute(checklistId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-${checklistId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const categoryCounts = useMemo(() => {
    const byCategory = new Map(metrics?.nonConformitiesByCategory.map((c) => [c.category, c.count]) ?? []);
    return CATEGORY_ORDER.map((category) => ({ category, count: byCategory.get(category) ?? 0 }));
  }, [metrics]);
  const maxCategoryCount = Math.max(1, ...categoryCounts.map((c) => c.count));

  return (
    <div className="stack">
      <div className="row-between">
        <h2>Dashboard</h2>
        <div className="row">
          <input placeholder="Placa" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} style={{ width: 110 }} />
          <input placeholder="Número ONU" value={unNumber} onChange={(e) => setUnNumber(e.target.value)} style={{ width: 130 }} />
          <label className="field-hint">
            De <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field-hint">
            Até <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" className="btn btn-secondary" onClick={load}>
            Aplicar filtros
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}

      {loading && <p>Carregando...</p>}

      {!loading && metrics && (
        <>
          <div className="grid-stats">
            <StatTile label="Checklists realizados" value={String(metrics.totalChecklists)} />
            <StatTile
              label="% de conformidade"
              value={`${metrics.complianceRate}%`}
              tone={metrics.complianceRate >= 80 ? 'good' : 'critical'}
            />
            <StatTile
              label="Não conformidades abertas"
              value={String(metrics.openNonConformities)}
              tone={metrics.openNonConformities > 0 ? 'critical' : 'good'}
            />
            <StatTile label="Vistorias no período" value={String(metrics.totalInspections)} />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Não conformidades por categoria</h3>
            {categoryCounts.map(({ category, count }) => (
              <div key={category} className="bar-row">
                <div className="bar-label">{CHECKLIST_CATEGORY_LABEL[category]}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                </div>
                <div className="bar-value">{count}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: metrics.pendingNonConformities.length > 0 ? 0 : undefined }}>
            <h3 style={{ margin: metrics.pendingNonConformities.length > 0 ? 'var(--space-4) var(--space-4) 0' : '0 0 var(--space-2)' }}>
              Não conformidades pendentes
            </h3>
            {metrics.pendingNonConformities.length === 0 && (
              <p>Nenhuma pendência no período/filtro selecionado.</p>
            )}
            {metrics.pendingNonConformities.length > 0 && (
              <div className="table-wrap" style={{ marginTop: 'var(--space-3)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.pendingNonConformities.map((nc) => (
                      <tr key={nc.id}>
                        <td>{CHECKLIST_CATEGORY_LABEL[nc.category]}</td>
                        <td>{nc.description}</td>
                        <td>
                          <span className="badge badge-critical">Aberta</span>
                        </td>
                        <td>{new Date(nc.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDownloadChecklistPdf(nc.sourceId)}
                          >
                            Ver checklist (PDF)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
