import { useEffect, useMemo, useState } from 'react';
import type { DashboardMetrics } from '../../domain/dashboard/dashboard-metrics';
import { CHECKLIST_CATEGORY_LABEL, type ChecklistCategory } from '../../domain/checklist/checklist-item';
import { GetDashboardMetricsUseCase } from '../../application/dashboard/get-dashboard-metrics.use-case';
import { DownloadChecklistPdfUseCase } from '../../application/checklist/download-checklist-pdf.use-case';
import { HttpDashboardRepository } from '../../infrastructure/dashboard/http-dashboard-repository';
import { HttpChecklistRepository } from '../../infrastructure/checklist/http-checklist-repository';
import { useAuth } from '../auth/AuthContext';

const CATEGORY_ORDER: ChecklistCategory[] = ['documentation', 'personnel', 'vehicle', 'equipment', 'cargo'];

const INK = { primary: '#0b0b0b', secondary: '#52514e', muted: '#898781' };
const SEQUENTIAL_BLUE = '#2a78d6';
const STATUS_CRITICAL = '#d03b3b';
const STATUS_GOOD = '#0ca30c';
const GRIDLINE = '#e1e0d9';

function StatTile({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ border: `1px solid ${GRIDLINE}`, borderRadius: 8, padding: '1rem', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: '0.8rem', color: INK.secondary }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 600, color: valueColor ?? INK.primary }}>{value}</div>
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
    <section>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <input placeholder="Placa" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
        <input placeholder="Número ONU" value={unNumber} onChange={(e) => setUnNumber(e.target.value)} />
        <label style={{ fontSize: '0.85rem', color: INK.secondary }}>
          De <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label style={{ fontSize: '0.85rem', color: INK.secondary }}>
          Até <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button type="button" onClick={load}>
          Aplicar filtros
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: STATUS_CRITICAL }}>
          {error}
        </p>
      )}

      {loading && <p>Carregando...</p>}

      {!loading && metrics && (
        <>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <StatTile label="Checklists realizados" value={String(metrics.totalChecklists)} />
            <StatTile
              label="% de conformidade"
              value={`${metrics.complianceRate}%`}
              valueColor={metrics.complianceRate >= 80 ? STATUS_GOOD : STATUS_CRITICAL}
            />
            <StatTile
              label="Não conformidades abertas"
              value={String(metrics.openNonConformities)}
              valueColor={metrics.openNonConformities > 0 ? STATUS_CRITICAL : STATUS_GOOD}
            />
            <StatTile label="Vistorias no período" value={String(metrics.totalInspections)} />
          </div>

          <h3 style={{ color: INK.primary }}>Não conformidades por categoria</h3>
          <div style={{ marginBottom: '2rem' }}>
            {categoryCounts.map(({ category, count }) => (
              <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ width: 140, fontSize: '0.85rem', color: INK.secondary }}>
                  {CHECKLIST_CATEGORY_LABEL[category]}
                </div>
                <div style={{ flex: 1, backgroundColor: GRIDLINE, borderRadius: 4, height: 20 }}>
                  <div
                    style={{
                      width: `${(count / maxCategoryCount) * 100}%`,
                      backgroundColor: SEQUENTIAL_BLUE,
                      height: '100%',
                      borderRadius: 4,
                      minWidth: count > 0 ? 4 : 0,
                    }}
                  />
                </div>
                <div style={{ width: 32, textAlign: 'right', fontSize: '0.85rem', color: INK.primary }}>
                  {count}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: INK.primary }}>Não conformidades pendentes</h3>
          {metrics.pendingNonConformities.length === 0 && <p>Nenhuma pendência no período/filtro selecionado.</p>}
          {metrics.pendingNonConformities.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: `1px solid ${GRIDLINE}` }}>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {metrics.pendingNonConformities.map((nc) => (
                  <tr key={nc.id} style={{ borderBottom: `1px solid ${GRIDLINE}` }}>
                    <td>{CHECKLIST_CATEGORY_LABEL[nc.category]}</td>
                    <td>{nc.description}</td>
                    <td>
                      <span
                        style={{
                          color: STATUS_CRITICAL,
                          border: `1px solid ${STATUS_CRITICAL}`,
                          borderRadius: 4,
                          padding: '0.1rem 0.4rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        ABERTA
                      </span>
                    </td>
                    <td>{new Date(nc.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <button type="button" onClick={() => handleDownloadChecklistPdf(nc.sourceId)}>
                        Ver checklist (PDF)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
