import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, Plus } from 'lucide-react';

interface PWAInstallPromptProps {
  onClose: () => void;
  onInstall: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose, onInstall }) => {
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [, setBrowserType] = useState<'chrome' | 'safari' | 'firefox' | 'edge' | 'other'>('other');

  useEffect(() => {
    // Detectar dispositivo y navegador
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setDeviceType('ios');
      setBrowserType('safari');
    } else if (isAndroid) {
      setDeviceType('android');
      if (userAgent.includes('chrome')) setBrowserType('chrome');
    } else {
      setDeviceType('desktop');
      if (userAgent.includes('chrome')) setBrowserType('chrome');
      else if (userAgent.includes('firefox')) setBrowserType('firefox');
      else if (userAgent.includes('edge')) setBrowserType('edge');
    }
  }, []);

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: '📱 Instalar MAIS en iOS',
          icon: <Share className="h-6 w-6 text-blue-600" />,
          steps: [
            { icon: '1️⃣', text: 'Presiona el botón de compartir', highlight: <Share className="h-4 w-4 inline mx-1 text-blue-600" /> },
            { icon: '2️⃣', text: 'Selecciona "Agregar a pantalla de inicio"', highlight: <Plus className="h-4 w-4 inline mx-1 text-green-600" /> },
            { icon: '3️⃣', text: 'Confirma la instalación' },
            { icon: '✨', text: '¡Listo! MAIS estará en tu pantalla de inicio' }
          ]
        };
      
      case 'android':
        return {
          title: '🤖 Instalar MAIS en Android',
          icon: <Download className="h-6 w-6 text-green-600" />,
          steps: [
            { icon: '1️⃣', text: 'Presiona "Instalar App" abajo' },
            { icon: '2️⃣', text: 'Confirma en el popup del navegador' },
            { icon: '3️⃣', text: 'La app se descargará automáticamente' },
            { icon: '✨', text: '¡MAIS estará en tu cajón de aplicaciones!' }
          ]
        };
      
      default:
        return {
          title: '💻 Instalar MAIS en Escritorio',
          icon: <Download className="h-6 w-6 text-purple-600" />,
          steps: [
            { icon: '1️⃣', text: 'Haz clic en "Instalar App"' },
            { icon: '2️⃣', text: 'Confirma en el diálogo del navegador' },
            { icon: '3️⃣', text: 'MAIS se instalará como una aplicación nativa' },
            { icon: '✨', text: '¡Accede desde tu escritorio o menú de inicio!' }
          ]
        };
    }
  };

  const instructions = getInstallInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {instructions.icon}
            <h3 className="text-xl font-bold text-gray-900 ml-3">
              {instructions.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* App Preview */}
          <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-1 rounded-xl mb-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                <img src="/icon-v2-192x192.png" alt="MAIS Logo" className="w-16 h-16 rounded-2xl" />
              </div>
              <h4 className="font-bold text-gray-900">MAIS Centro de Mando</h4>
              <p className="text-sm text-gray-600">Política • Gratis • PWA</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{step.icon}</span>
                <span className="text-gray-700 flex-1 flex items-center">
                  {step.text}
                  {step.highlight && step.highlight}
                </span>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">🌟 Beneficios de la App:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• ⚡ Acceso instantáneo sin navegador</li>
              <li>• 📴 Funciona sin conexión</li>
              <li>• 🔔 Notificaciones push</li>
              <li>• 💾 Ocupa menos espacio que apps nativas</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {deviceType === 'android' || deviceType === 'desktop' ? (
              <button
                onClick={onInstall}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Instalar App Ahora
              </button>
            ) : (
              <div className="bg-blue-100 border border-blue-300 rounded-xl p-4 text-center">
                <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 font-semibold">
                  Usa el botón <Share className="h-4 w-4 inline mx-1" /> de Safari para instalar
                </p>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Instalar más tarde
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 text-center">
            Desarrollado por Daniel Lopez "DSimnivaciones" Wramba fxiw
          </p>
        </div>
      </div>
    </div>
  );
};