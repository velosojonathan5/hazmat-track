import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HealthPage } from './presentation/pages/HealthPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HealthPage />
  </StrictMode>,
);
