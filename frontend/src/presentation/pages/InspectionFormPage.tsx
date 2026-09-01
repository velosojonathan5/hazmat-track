import { useEffect, useMemo, useState } from 'react';
import type { Inspection, RingelmannGrade } from '../../domain/inspection/inspection';
import { RINGELMANN_DENSITY } from '../../domain/inspection/inspection';
import type { NewInspectionEvidence } from '../../domain/inspection/inspection-evidence';
import { RegisterInspectionUseCase } from '../../application/inspection/register-inspection.use-case';
import { DownloadInspectionPdfUseCase } from '../../application/inspection/download-inspection-pdf.use-case';
import { UploadFileUseCase } from '../../application/upload/upload-file.use-case';
import { HttpInspectionRepository } from '../../infrastructure/inspection/http-inspection-repository';
import { HttpUploadRepository } from '../../infrastructure/upload/http-upload-repository';
import { useAuth } from '../auth/AuthContext';

const RINGELMANN_GRADES: RingelmannGrade[] = [0, 1, 2, 3, 4, 5];

export function InspectionFormPage() {
  const { session } = useAuth();
  const inspectionRepository = useMemo(
    () => new HttpInspectionRepository(session!.accessToken),
    [session],
  );
  const uploadRepository = useMemo(() => new HttpUploadRepository(session!.accessToken), [session]);
  const registerInspection = useMemo(
    () => new RegisterInspectionUseCase(inspectionRepository),
    [inspectionRepository],
  );
  const downloadPdf = useMemo(
    () => new DownloadInspectionPdfUseCase(inspectionRepository),
    [inspectionRepository],
  );
  const uploadFile = useMemo(() => new UploadFileUseCase(uploadRepository), [uploadRepository]);

  const [vehiclePlate, setVehiclePlate] = useState('');
  const [unNumber, setUnNumber] = useState('');
  const [comments, setComments] = useState('');
  const [ringelmannGrade, setRingelmannGrade] = useState<RingelmannGrade | undefined>(undefined);
  const [evidences, setEvidences] = useState<NewInspectionEvidence[]>([]);
  const [uploading, setUploading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(() =>
    navigator.geolocation ? null : 'Geolocalização não é suportada neste navegador.',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Inspection | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => setLocationError('Não foi possível obter a localização. Autorize o acesso e recarregue a página.'),
    );
  }, []);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadFile.execute(file);
      setEvidences((current) => [
        ...current,
        {
          type: file.type.startsWith('video') ? 'video' : 'photo',
          url: uploaded.url,
          storageKey: uploaded.key,
        },
      ]);
    } catch {
      setError('Falha ao enviar o arquivo.');
    } finally {
      setUploading(false);
    }
  }

  function removeEvidence(index: number) {
    setEvidences((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!coords) {
      setError('Aguardando localização do navegador.');
      return;
    }
    if (evidences.length === 0) {
      setError('Anexe ao menos uma foto ou vídeo.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const inspection = await registerInspection.execute({
        vehiclePlate,
        unNumber,
        latitude: coords.latitude,
        longitude: coords.longitude,
        ringelmannGrade,
        comments: comments || undefined,
        evidences,
      });
      setResult(inspection);
    } catch {
      setError('Não foi possível registrar a vistoria. Confira os campos e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownloadPdf(inspectionId: string) {
    const blob = await downloadPdf.execute(inspectionId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspection-${inspectionId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleNewInspection() {
    setResult(null);
    setVehiclePlate('');
    setUnNumber('');
    setComments('');
    setRingelmannGrade(undefined);
    setEvidences([]);
  }

  if (session?.user.role !== 'inspector') {
    return <p>Apenas o perfil Inspetor pode registrar vistorias.</p>;
  }

  if (result) {
    return (
      <div className="card">
        <h2>Vistoria registrada</h2>
        <p style={{ margin: 'var(--space-3) 0' }}>{result.evidences.length} evidência(s) anexada(s).</p>
        <div className="row" style={{ marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn btn-primary" onClick={() => handleDownloadPdf(result.id)}>
            Baixar laudo em PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleNewInspection}>
            Nova vistoria
          </button>
        </div>
      </div>
    );
  }

  const locationDotClass = coords ? 'is-ready' : locationError ? 'is-error' : '';

  return (
    <div className="stack">
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Dados da vistoria</h3>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label className="field-label" htmlFor="vehiclePlate">
              Placa do veículo
            </label>
            <input
              id="vehiclePlate"
              value={vehiclePlate}
              onChange={(event) => setVehiclePlate(event.target.value)}
              required
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label className="field-label" htmlFor="unNumber">
              Número ONU
            </label>
            <input id="unNumber" value={unNumber} onChange={(event) => setUnNumber(event.target.value)} required />
          </div>
        </div>
        <div className="location-status" style={{ marginTop: 'var(--space-4)' }}>
          <span className={`location-dot ${locationDotClass}`} />
          {coords
            ? `Localização capturada: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
            : locationError
              ? locationError
              : 'Obtendo localização...'}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-1)' }}>Escala de Ringelmann</h3>
        <p className="field-hint" style={{ marginBottom: 'var(--space-4)' }}>
          Densidade de fumaça no escapamento (opcional)
        </p>
        <div className="ringelmann-grid">
          {RINGELMANN_GRADES.map((grade) => (
            <label
              key={grade}
              className={`ringelmann-option${ringelmannGrade === grade ? ' is-selected' : ''}`}
            >
              <div className="ringelmann-swatch" style={{ backgroundColor: `rgba(0,0,0,${grade / 5})` }} />
              <input
                type="radio"
                name="ringelmann"
                checked={ringelmannGrade === grade}
                onChange={() => setRingelmannGrade(grade)}
              />
              <div className="ringelmann-caption">
                Grau {grade}
                <br />
                {RINGELMANN_DENSITY[grade]}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Evidências (foto/vídeo)</h3>
        <input type="file" accept="image/*,video/*" onChange={handleFileSelected} disabled={uploading} />
        {uploading && <p className="upload-status" style={{ marginTop: 'var(--space-2)' }}>Enviando arquivo...</p>}
        {evidences.length > 0 && (
          <div className="chip-list" style={{ marginTop: 'var(--space-4)' }}>
            {evidences.map((evidence, index) => (
              <div key={evidence.storageKey} className="chip">
                <span className="badge badge-neutral">{evidence.type === 'photo' ? 'Foto' : 'Vídeo'}</span>
                <a className="chip-link" href={evidence.url} target="_blank" rel="noreferrer">
                  {evidence.url}
                </a>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeEvidence(index)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Observações</h3>
        <textarea value={comments} onChange={(event) => setComments(event.target.value)} rows={3} style={{ width: '100%' }} />
      </div>

      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}

      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Enviando...' : 'Registrar vistoria'}
      </button>
    </div>
  );
}
