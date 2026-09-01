import { useState, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ChecklistFormPage } from '../pages/ChecklistFormPage';
import { ChecklistHistoryPage } from '../pages/ChecklistHistoryPage';
import { InspectionFormPage } from '../pages/InspectionFormPage';
import { InspectionHistoryPage } from '../pages/InspectionHistoryPage';

type Tab = 'checklist-form' | 'checklist-history' | 'inspection-form' | 'inspection-history';

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontWeight: active ? 'bold' : 'normal',
        textDecoration: active ? 'underline' : 'none',
        marginRight: '1rem',
      }}
    >
      {children}
    </button>
  );
}

const TAB_CONTENT: Record<Tab, ReactNode> = {
  'checklist-form': <ChecklistFormPage />,
  'checklist-history': <ChecklistHistoryPage />,
  'inspection-form': <InspectionFormPage />,
  'inspection-history': <InspectionHistoryPage />,
};

export function AppShell() {
  const { session, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('checklist-form');

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>HazmatTrack</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>
            {session?.user.name} ({session?.user.role})
          </span>
          <button type="button" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <nav style={{ margin: '1.5rem 0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
        <TabButton active={tab === 'checklist-form'} onClick={() => setTab('checklist-form')}>
          Novo Checklist
        </TabButton>
        <TabButton active={tab === 'checklist-history'} onClick={() => setTab('checklist-history')}>
          Histórico de Checklists
        </TabButton>
        <TabButton active={tab === 'inspection-form'} onClick={() => setTab('inspection-form')}>
          Nova Vistoria
        </TabButton>
        <TabButton active={tab === 'inspection-history'} onClick={() => setTab('inspection-history')}>
          Histórico de Vistorias
        </TabButton>
      </nav>

      {TAB_CONTENT[tab]}
    </div>
  );
}
