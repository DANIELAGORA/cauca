import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Cargando AgoraMais...</p>
          <p className="text-sm mt-2">Conectando con Supabase...</p>
        </div>
      </div>
    );
  }

  // Si hay usuario logueado, mostrar dashboard
  if (state.user) {
    return (
      <Layout>
        <Dashboard />
      </Layout>
    );
  }

  // Si se solicitó mostrar auth, mostrar formulario
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowAuth(false)}
              className="text-blue-100 hover:text-white mb-4 text-sm"
            >
              ← Volver a información del partido
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">AgoraMais</h1>
            <p className="text-blue-100 text-lg">Centro de Mando Político</p>
            <p className="text-blue-200 text-sm mt-2">Movimiento Alternativo Indígena y Social</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  // Por defecto, mostrar landing page
  return (
    <LandingPage 
      onAccessClick={() => setShowAuth(true)} 
    />
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