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
      <section>
        <h2>Checklist enviado</h2>
        <p>
          Status geral:{' '}
          <strong style={{ color: result.status === 'compliant' ? 'green' : 'crimson' }}>
            {result.status === 'compliant' ? 'CONFORME' : 'NÃO CONFORME'}
          </strong>
        </p>
        <button type="button" onClick={() => handleDownloadPdf(result.id)}>
          Baixar PDF
        </button>
        <button type="button" onClick={handleNewChecklist} style={{ marginLeft: '0.75rem' }}>
          Novo checklist
        </button>
      </section>
    );
  }

  if (loadingItems) {
    return <p>Carregando itens do checklist...</p>;
  }

  return (
    <section>
      <fieldset>
        <legend>Dados do transporte</legend>
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
          <label htmlFor="driverName">Motorista</label>
          <br />
          <input
            id="driverName"
            value={driverName}
            onChange={(event) => setDriverName(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="driverCnh">CNH do motorista</label>
          <br />
          <input
            id="driverCnh"
            value={driverCnh}
            onChange={(event) => setDriverCnh(event.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="unNumber">Número ONU</label>
          <br />
          <input id="unNumber" value={unNumber} onChange={(event) => setUnNumber(event.target.value)} required />
        </div>
      </fieldset>

      {CATEGORY_ORDER.map((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        if (categoryItems.length === 0) {
          return null;
        }

        return (
          <fieldset key={category} style={{ marginTop: '1rem' }}>
            <legend>{CHECKLIST_CATEGORY_LABEL[category]}</legend>
            {categoryItems.map((item) => (
              <div key={item.id} style={{ marginBottom: '0.75rem' }}>
                <strong>{item.code}</strong> {item.description}
                <div>
                  {ANSWER_OPTIONS.map((option) => (
                    <label key={option} style={{ marginRight: '1rem' }}>
                      <input
                        type="radio"
                        name={`answer-${item.id}`}
                        checked={answers[item.id]?.answer === option}
                        onChange={() => updateAnswer(item.id, { answer: option })}
                      />{' '}
                      {ANSWER_LABEL[option]}
                    </label>
                  ))}
                  <input
                    placeholder="Observação (opcional)"
                    value={answers[item.id]?.note ?? ''}
                    onChange={(event) => updateAnswer(item.id, { note: event.target.value })}
                    style={{ marginLeft: '0.5rem' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handlePhotoSelected(item.id, event)}
                    disabled={answers[item.id]?.uploadingPhoto}
                    style={{ marginLeft: '0.5rem' }}
                  />
                  {answers[item.id]?.uploadingPhoto && <span> enviando...</span>}
                  {answers[item.id]?.photoUrl && <span> ✓ foto anexada</span>}
                </div>
              </div>
            ))}
          </fieldset>
        );
      })}

      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      <button type="button" onClick={handleSubmit} disabled={submitting} style={{ marginTop: '1rem' }}>
        {submitting ? 'Enviando...' : 'Enviar checklist'}
      </button>
    </section>
  );
}
