import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalado
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Solo mostrar después de 5 segundos si no está instalado
      setTimeout(() => {
        if (!isInstalled) {
          setShowBanner(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // No mostrar de nuevo por 24 horas
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // No mostrar si está instalado o fue rechazado recientemente
  if (isInstalled) return null;
  
  const lastDismissed = localStorage.getItem('pwa-banner-dismissed');
  if (lastDismissed) {
    const timeSinceDismissed = Date.now() - parseInt(lastDismissed);
    if (timeSinceDismissed < 24 * 60 * 60 * 1000) return null; // 24 horas
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
              <img 
                src="/app.ico" 
                alt="MAIS Logo" 
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  console.log('Error cargando app.ico, intentando fallback...');
                  // Fallback a app.png si app.ico falla
                  e.currentTarget.src = '/app.png';
                  e.currentTarget.onerror = () => {
                    console.log('Error cargando app.png también');
                    // Si todo falla, ocultar imagen y mostrar texto
                    e.currentTarget.style.display = 'none';
                  };
                }}
                onLoad={() => {
                  console.log('✅ Logo MAIS cargado correctamente');
                }}
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Instalar MAIS</h4>
              <p className="text-xs text-gray-600">Acceso rápido desde tu escritorio</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-red-600 to-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-md transition-all flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700"
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
};