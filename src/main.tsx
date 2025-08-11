import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logInfo, logError } from './utils/logger';

// Registrar el Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // sw.js será generado por vite-plugin-pwa
      .then(registration => {
        logInfo('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        logError('Fallo el registro del Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);