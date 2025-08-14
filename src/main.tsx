import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logInfo, logError } from './utils/logger';

// Service Worker registration será manejado por vite-plugin-pwa automáticamente
// No registrar manualmente para evitar conflictos
if ('serviceWorker' in navigator && import.meta.env.DEV) {
  logInfo('Service Worker será registrado automáticamente por vite-plugin-pwa');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);