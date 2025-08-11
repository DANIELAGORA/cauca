import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { getDemoCredentials } from '../data/demoUsers';
import { 
  User,
  ArrowRight,
  Users,
  Zap,
  ArrowLeft
} from 'lucide-react';

export const DirectLogin: React.FC = () => {
  const { loginDirect } = useApp();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(true);
  
  const demoCredentials = getDemoCredentials();

  const handleQuickLogin = async (credentials: any) => {
    setError(null);
    
    try {
      await loginDirect(credentials.name, credentials.email, credentials.password);
    } catch (err: any) {
      setError(err.message || 'Error al acceder.');
    }
  };

  const handleCustomLogin = async () => {
    if (!userName.trim()) {
      setError('Por favor, introduce tu nombre.');
      return;
    }

    setError(null);
    
    try {
      await loginDirect(userName.trim(), 'demo@mais.com', 'demo123');
    } catch (err: any) {
      setError(err.message || 'Error al acceder.');
    }
  };

  if (!showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Personalizado
            </h2>
            <p className="text-gray-600 text-sm">
              Introduce tu nombre para acceder
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu nombre
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Introduce tu nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDemo(true)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </button>
              <button
                onClick={handleCustomLogin}
                disabled={!userName.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Acceso Directo MAIS
          </h1>
          <p className="text-gray-600">
            Selecciona una cuenta demo para acceder rápidamente
          </p>
        </div>

        <div className="space-y-4">
          {demoCredentials.map((credential, index) => (
            <button
              key={index}
              onClick={() => handleQuickLogin(credential)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {credential.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {credential.role} • {credential.email}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowDemo(false)}
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <User className="h-4 w-4 mr-2" />
            Acceso Personalizado
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};