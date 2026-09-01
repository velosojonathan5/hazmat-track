import { useEffect, useMemo, useState } from 'react';
import type { Inspection } from '../../domain/inspection/inspection';
import { RINGELMANN_DENSITY } from '../../domain/inspection/inspection';
import { ListInspectionsUseCase } from '../../application/inspection/list-inspections.use-case';
import { DownloadInspectionPdfUseCase } from '../../application/inspection/download-inspection-pdf.use-case';
import { HttpInspectionRepository } from '../../infrastructure/inspection/http-inspection-repository';
import { useAuth } from '../auth/AuthContext';

export function InspectionHistoryPage() {
  const { session } = useAuth();
  const repository = useMemo(() => new HttpInspectionRepository(session!.accessToken), [session]);
  const listInspections = useMemo(() => new ListInspectionsUseCase(repository), [repository]);
  const downloadPdf = useMemo(() => new DownloadInspectionPdfUseCase(repository), [repository]);

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [plateFilter, setPlateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load(vehiclePlate?: string) {
    setLoading(true);
    setError(null);
    listInspections
      .execute({ vehiclePlate: vehiclePlate || undefined })
      .then(setInspections)
      .catch(() => setError('Não foi possível carregar o histórico.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDownloadPdf(inspectionId: string) {
    const blob = await downloadPdf.execute(inspectionId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspection-${inspectionId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <h2>Histórico de vistorias</h2>

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

      {!loading && inspections.length === 0 && <p>Nenhuma vistoria encontrada.</p>}

      {!loading && inspections.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
              <th>Data</th>
              <th>Placa</th>
              <th>ONU</th>
              <th>Ringelmann</th>
              <th>Evidências</th>
              <th>Inspetor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{new Date(inspection.createdAt).toLocaleString('pt-BR')}</td>
                <td>{inspection.vehiclePlate}</td>
                <td>{inspection.unNumber}</td>
                <td>
                  {inspection.ringelmannGrade === undefined
                    ? '—'
                    : `grau ${inspection.ringelmannGrade} (${RINGELMANN_DENSITY[inspection.ringelmannGrade]})`}
                </td>
                <td>{inspection.evidences.length}</td>
                <td>{inspection.inspectorName}</td>
                <td>
                  <button type="button" onClick={() => handleDownloadPdf(inspection.id)}>
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
