import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const FloatingPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Detectar si ya está instalada la PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInApp = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInApp) {
      setShowInstallButton(false);
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Detectar si se instaló la app
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Mostrar botón después de 3 segundos si no se detectó el prompt
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone && !isInApp) {
        setShowInstallButton(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó instalar la PWA MAIS');
          setShowInstallButton(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error al mostrar prompt de instalación:', error);
      }
    } else {
      // Fallback: mostrar instrucciones manuales
      alert('Para instalar MAIS Centro de Mando:\n\n• Chrome/Edge: Menú > Instalar aplicación\n• Safari iOS: Compartir > Añadir a pantalla de inicio\n• Firefox: Menú > Instalar');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Reaparecer después de 30 segundos
    setTimeout(() => setIsVisible(true), 30000);
  };

  if (!showInstallButton || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Botón principal con app.ico */}
          <motion.button
            onClick={handleInstallClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300"
          >
            {/* Icono app.ico como imagen */}
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/app.ico" 
                alt="Instalar MAIS PWA" 
                className="w-6 h-6 filter brightness-0 invert"
              />
            </div>
            
            {/* Indicador de descarga */}
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <Download className="w-3 h-3 text-white" />
            </div>

            {/* Animación de pulso */}
            <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </motion.button>

          {/* Botón de cerrar */}
          <motion.button
            onClick={handleDismiss}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-2 -left-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1 shadow-lg transition-colors"
          >
            <X className="w-3 h-3" />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl pointer-events-none"
          >
            <div className="flex items-center gap-2">
              <img 
                src="/app.png" 
                alt="MAIS" 
                className="w-4 h-4 rounded"
              />
              <span>Instalar MAIS Centro de Mando</span>
            </div>
            
            {/* Flecha */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};