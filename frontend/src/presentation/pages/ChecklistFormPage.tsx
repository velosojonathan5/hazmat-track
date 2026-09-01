import { useEffect, useMemo, useState } from 'react';
import { ANSWER_LABEL, type AnswerValue, type Checklist } from '../../domain/checklist/checklist';
import { CHECKLIST_CATEGORY_LABEL, type ChecklistCategory, type ChecklistItem } from '../../domain/checklist/checklist-item';
import { ListChecklistItemsUseCase } from '../../application/checklist/list-checklist-items.use-case';
import { SubmitChecklistUseCase } from '../../application/checklist/submit-checklist.use-case';
import { DownloadChecklistPdfUseCase } from '../../application/checklist/download-checklist-pdf.use-case';
import { UploadFileUseCase } from '../../application/upload/upload-file.use-case';
import { HttpChecklistRepository } from '../../infrastructure/checklist/http-checklist-repository';
import { HttpUploadRepository } from '../../infrastructure/upload/http-upload-repository';
import { useAuth } from '../auth/AuthContext';

const CATEGORY_ORDER: ChecklistCategory[] = ['documentation', 'personnel', 'vehicle', 'equipment', 'cargo'];
const ANSWER_OPTIONS: AnswerValue[] = ['yes', 'no', 'not_applicable'];

interface AnswerState {
  answer: AnswerValue;
  note: string;
  photoUrl?: string;
  uploadingPhoto?: boolean;
}

export function ChecklistFormPage() {
  const { session } = useAuth();
  const repository = useMemo(
    () => new HttpChecklistRepository(session!.accessToken),
    [session],
  );
  const listItems = useMemo(() => new ListChecklistItemsUseCase(repository), [repository]);
  const submitChecklist = useMemo(() => new SubmitChecklistUseCase(repository), [repository]);
  const downloadPdf = useMemo(() => new DownloadChecklistPdfUseCase(repository), [repository]);
  const uploadRepository = useMemo(() => new HttpUploadRepository(session!.accessToken), [session]);
  const uploadFile = useMemo(() => new UploadFileUseCase(uploadRepository), [uploadRepository]);

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverCnh, setDriverCnh] = useState('');
  const [unNumber, setUnNumber] = useState('');
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Checklist | null>(null);

  useEffect(() => {
    listItems
      .execute()
      .then((loadedItems) => {
        setItems(loadedItems);
        setAnswers(
          Object.fromEntries(loadedItems.map((item) => [item.id, { answer: 'yes' as AnswerValue, note: '' }])),
        );
      })
      .catch(() => setError('Não foi possível carregar os itens do checklist.'))
      .finally(() => setLoadingItems(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateAnswer(itemId: string, patch: Partial<AnswerState>) {
    setAnswers((current) => ({ ...current, [itemId]: { ...current[itemId], ...patch } }));
  }

  async function handlePhotoSelected(itemId: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    updateAnswer(itemId, { uploadingPhoto: true });
    try {
      const uploaded = await uploadFile.execute(file);
      updateAnswer(itemId, { photoUrl: uploaded.url, uploadingPhoto: false });
    } catch {
      updateAnswer(itemId, { uploadingPhoto: false });
      setError('Falha ao enviar a foto.');
    }
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    try {
      const checklist = await submitChecklist.execute({
        vehiclePlate,
        driverName,
        driverCnh,
        unNumber,
        answers: items.map((item) => ({
          itemDefinitionId: item.id,
          answer: answers[item.id].answer,
          note: answers[item.id].note || undefined,
          photoUrl: answers[item.id].photoUrl,
        })),
      });
      setResult(checklist);
    } catch {
      setError('Não foi possível enviar o checklist. Confira os campos e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownloadPdf(checklistId: string) {
    const blob = await downloadPdf.execute(checklistId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-${checklistId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleNewChecklist() {
    setResult(null);
    setVehiclePlate('');
    setDriverName('');
    setDriverCnh('');
    setUnNumber('');
    setAnswers(Object.fromEntries(items.map((item) => [item.id, { answer: 'yes' as AnswerValue, note: '' }])));
  }

  if (session?.user.role !== 'inspector') {
    return <p>Apenas o perfil Inspetor pode preencher checklists.</p>;
  }

  if (result) {
    return (
      <div className="card">
        <h2>Checklist enviado</h2>
        <p style={{ margin: 'var(--space-3) 0' }}>
          Status geral:{' '}
          <span className={`badge ${result.status === 'compliant' ? 'badge-good' : 'badge-critical'}`}>
            {result.status === 'compliant' ? 'Conforme' : 'Não conforme'}
          </span>
        </p>
        <div className="row" style={{ marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn btn-primary" onClick={() => handleDownloadPdf(result.id)}>
            Baixar PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleNewChecklist}>
            Novo checklist
          </button>
        </div>
      </div>
    );
  }

  if (loadingItems) {
    return <p>Carregando itens do checklist...</p>;
  }

  return (
    <div className="stack">
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Dados do transporte</h3>
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
            <label className="field-label" htmlFor="driverName">
              Motorista
            </label>
            <input
              id="driverName"
              value={driverName}
              onChange={(event) => setDriverName(event.target.value)}
              required
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label className="field-label" htmlFor="driverCnh">
              CNH do motorista
            </label>
            <input
              id="driverCnh"
              value={driverCnh}
              onChange={(event) => setDriverCnh(event.target.value)}
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
      </div>

      {CATEGORY_ORDER.map((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        if (categoryItems.length === 0) {
          return null;
        }

        return (
          <div key={category} className="card">
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{CHECKLIST_CATEGORY_LABEL[category]}</h3>
            {categoryItems.map((item) => (
              <div key={item.id} className="checklist-item">
                <div className="checklist-item-text">
                  <span className="checklist-item-code">{item.code}</span>
                  {item.description}
                </div>
                <div className="row">
                  <div className="segmented">
                    {ANSWER_OPTIONS.map((option) => (
                      <div key={option} className={`segmented-option${option === 'no' ? ' answer-no' : ''}`}>
                        <input
                          type="radio"
                          id={`answer-${item.id}-${option}`}
                          name={`answer-${item.id}`}
                          checked={answers[item.id]?.answer === option}
                          onChange={() => updateAnswer(item.id, { answer: option })}
                        />
                        <label htmlFor={`answer-${item.id}-${option}`}>{ANSWER_LABEL[option]}</label>
                      </div>
                    ))}
                  </div>
                  <input
                    className="note-input"
                    placeholder="Observação (opcional)"
                    value={answers[item.id]?.note ?? ''}
                    onChange={(event) => updateAnswer(item.id, { note: event.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handlePhotoSelected(item.id, event)}
                    disabled={answers[item.id]?.uploadingPhoto}
                  />
                  {answers[item.id]?.uploadingPhoto && <span className="upload-status">enviando...</span>}
                  {answers[item.id]?.photoUrl && <span className="upload-status is-done">✓ foto anexada</span>}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}

      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar checklist'}
      </button>
    </div>
  );
}
