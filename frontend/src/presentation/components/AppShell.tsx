import { useState, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ChecklistFormPage } from '../pages/ChecklistFormPage';
import { ChecklistHistoryPage } from '../pages/ChecklistHistoryPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InspectionFormPage } from '../pages/InspectionFormPage';
import { InspectionHistoryPage } from '../pages/InspectionHistoryPage';

type Tab =
  | 'dashboard'
  | 'checklist-form'
  | 'checklist-history'
  | 'inspection-form'
  | 'inspection-history';

const ROLE_LABEL: Record<string, string> = {
  inspector: 'Inspetor',
  manager: 'Gestor',
};

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'checklist-form', label: 'Novo Checklist' },
  { id: 'checklist-history', label: 'Histórico de Checklists' },
  { id: 'inspection-form', label: 'Nova Vistoria' },
  { id: 'inspection-history', label: 'Histórico de Vistorias' },
];

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
    <button type="button" className={`tab-button${active ? ' is-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

const TAB_CONTENT: Record<Tab, ReactNode> = {
  dashboard: <DashboardPage />,
  'checklist-form': <ChecklistFormPage />,
  'checklist-history': <ChecklistHistoryPage />,
  'inspection-form': <InspectionFormPage />,
  'inspection-history': <InspectionHistoryPage />,
};

export function AppShell() {
  const { session, logout } = useAuth();
  const [tab, setTab] = useState<Tab>(session?.user.role === 'manager' ? 'dashboard' : 'checklist-form');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">HT</span>
          <h1>HazmatTrack</h1>
        </div>
        <div className="row">
          <span className="session-info">
            {session?.user.name} · {session ? ROLE_LABEL[session.user.role] : ''}
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <nav className="app-nav">
        {TABS.map((item) => (
          <TabButton key={item.id} active={tab === item.id} onClick={() => setTab(item.id)}>
            {item.label}
          </TabButton>
        ))}
      </nav>

      {TAB_CONTENT[tab]}
    </div>
  );
}
