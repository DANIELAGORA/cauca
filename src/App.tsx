import React, { useState, useCallback } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { logInfo } from './utils/logger';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
      <div className="space-y-2">
        <p className="text-2xl font-semibold">AgoraMais</p>
        <p className="text-lg">Centro de Mando Político</p>
        <p className="text-sm opacity-90">Conectando con Supabase...</p>
      </div>
    </div>
  </div>
);

const AuthScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <button 
          onClick={onBack}
          className="text-red-100 hover:text-white mb-4 text-sm transition-colors duration-200 flex items-center justify-center gap-1"
          aria-label="Volver a información del partido"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a información del partido
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">AgoraMais</h1>
        <p className="text-red-100 text-lg">Centro de Mando Político</p>
        <p className="text-red-200 text-sm mt-2">Movimiento Alternativo Indígena y Social</p>
      </div>
      <AuthForm onSuccess={() => logInfo('Usuario autenticado exitosamente')} />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  const handleShowAuth = useCallback(() => {
    setShowAuth(true);
    logInfo('Mostrando formulario de autenticación');
  }, []);

  const handleHideAuth = useCallback(() => {
    setShowAuth(false);
    logInfo('Ocultando formulario de autenticación');
  }, []);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.user) {
    return (
      <>
        <Layout>
          <Dashboard />
        </Layout>
        <PWAInstallBanner />
      </>
    );
  }

  if (showAuth) {
    return <AuthScreen onBack={handleHideAuth} />;
  }

  return (
    <>
      <LandingPage onAccessClick={handleShowAuth} />
      <PWAInstallBanner />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;