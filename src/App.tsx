import React, { useState, useCallback } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LandingPageNew } from './components/LandingPageNew';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { logInfo } from './utils/logger';

const LoadingScreen: React.FC = () => {
  const [loadingStep, setLoadingStep] = React.useState('Iniciando sistema...');
  const [logoError, setLogoError] = React.useState(false);

  React.useEffect(() => {
    const steps = [
      'Iniciando sistema...',
      'Configurando conexión...',
      'Verificando credenciales...',
      'Preparando interfaz...',
      'Casi listo...'
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setLoadingStep(steps[currentStep]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="relative mb-8">
          {!logoError ? (
            <img 
              src="/app.png" 
              alt="MAIS Logo" 
              className="w-20 h-20 mx-auto rounded-2xl animate-pulse shadow-2xl object-cover"
              onError={() => {
                console.log('🚨 app.png falló, intentando fallback');
                setLogoError(true);
              }}
            />
          ) : (
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-bold">M</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-2xl animate-spin"></div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">MAIS Cauca</p>
          <p className="text-xl">Centro de Mando Político</p>
          <p className="text-sm opacity-90">{loadingStep}</p>
          <div className="w-64 mx-auto mt-4">
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <button 
          onClick={onBack}
          className="text-red-100 hover:text-white mb-6 text-sm transition-colors duration-200 flex items-center justify-center gap-1"
          aria-label="Volver a información del partido"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a información del partido
        </button>
        <div className="mb-6">
          <img src="/app.ico" alt="MAIS Logo" className="w-16 h-16 mx-auto rounded-2xl shadow-2xl" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent mb-2">MAIS Cauca</h1>
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
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleShowAuth = useCallback(() => {
    setShowAuth(true);
    logInfo('Mostrando formulario de autenticación');
  }, []);

  const handleHideAuth = useCallback(() => {
    setShowAuth(false);
    logInfo('Ocultando formulario de autenticación');
  }, []);

  const handleNavigationChange = useCallback((section: string) => {
    setActiveSection(section);
    logInfo('🔀 App - Cambiando a sección:', section);
  }, []);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.user) {
    return (
      <>
        <Layout activeSection={activeSection}>
          <Dashboard activeSection={activeSection} />
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
      <LandingPageNew onAccessClick={handleShowAuth} />
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