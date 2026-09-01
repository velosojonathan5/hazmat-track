import { useState, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ChecklistFormPage } from '../pages/ChecklistFormPage';
import { ChecklistHistoryPage } from '../pages/ChecklistHistoryPage';

type Tab = 'form' | 'history';

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

export function AppShell() {
  const { session, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('form');

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
        <TabButton active={tab === 'form'} onClick={() => setTab('form')}>
          Novo Checklist
        </TabButton>
        <TabButton active={tab === 'history'} onClick={() => setTab('history')}>
          Histórico
        </TabButton>
      </nav>

      {tab === 'form' ? <ChecklistFormPage /> : <ChecklistHistoryPage />}
    </div>
  );
}
