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
      <section>
        <h2>Vistoria registrada</h2>
        <p>{result.evidences.length} evidência(s) anexada(s).</p>
        <button type="button" onClick={() => handleDownloadPdf(result.id)}>
          Baixar laudo em PDF
        </button>
        <button type="button" onClick={handleNewInspection} style={{ marginLeft: '0.75rem' }}>
          Nova vistoria
        </button>
      </section>
    );
  }

  return (
    <section>
      <fieldset>
        <legend>Dados da vistoria</legend>
        <div>
          <label htmlFor="vehiclePlate">Placa do veículo</label>
          <br />
          <input
            id="vehiclePlate"
            value={vehiclePlate}
            onChange={(event) => setVehiclePlate(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="unNumber">Número ONU</label>
          <br />
          <input id="unNumber" value={unNumber} onChange={(event) => setUnNumber(event.target.value)} required />
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          {coords
            ? `Localização capturada: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
            : locationError
              ? locationError
              : 'Obtendo localização...'}
        </p>
      </fieldset>

      <fieldset style={{ marginTop: '1rem' }}>
        <legend>Escala de Ringelmann (densidade de fumaça, opcional)</legend>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {RINGELMANN_GRADES.map((grade) => (
            <label key={grade} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  margin: '0 auto 0.25rem',
                  border: ringelmannGrade === grade ? '2px solid #333' : '1px solid #ccc',
                  backgroundColor: `rgba(0,0,0,${grade / 5})`,
                }}
              />
              <input
                type="radio"
                name="ringelmann"
                checked={ringelmannGrade === grade}
                onChange={() => setRingelmannGrade(grade)}
              />{' '}
              grau {grade} ({RINGELMANN_DENSITY[grade]})
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ marginTop: '1rem' }}>
        <legend>Evidências (foto/vídeo)</legend>
        <input type="file" accept="image/*,video/*" onChange={handleFileSelected} disabled={uploading} />
        {uploading && <p>Enviando arquivo...</p>}
        <ul>
          {evidences.map((evidence, index) => (
            <li key={evidence.storageKey}>
              [{evidence.type}] {evidence.url}{' '}
              <button type="button" onClick={() => removeEvidence(index)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset style={{ marginTop: '1rem' }}>
        <legend>Observações</legend>
        <textarea
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          rows={3}
          style={{ width: '100%' }}
        />
      </fieldset>

      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      <button type="button" onClick={handleSubmit} disabled={submitting} style={{ marginTop: '1rem' }}>
        {submitting ? 'Enviando...' : 'Registrar vistoria'}
      </button>
    </section>
  );
}
