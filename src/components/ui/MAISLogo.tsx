import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MAISLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: string;
  variant?: 'png' | 'ico' | 'svg';
  className?: string;
  animate?: boolean;
  fallbackChain?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6', 
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  custom: ''
};

export const MAISLogo: React.FC<MAISLogoProps> = ({ 
  size = 'md',
  customSize,
  variant = 'png',
  className = '',
  animate = false,
  fallbackChain = true,
  onClick
}) => {
  const [currentSrc, setCurrentSrc] = useState(`/app.${variant}`);
  const [hasErrored, setHasErrored] = useState(false);

  // Cadena de fallbacks inteligente
  const fallbackSequence = [
    '/app.png',    // Mejor calidad
    '/app.ico',    // Más compatible  
    '/favicon.png', // Backup estándar
    '/favicon.ico'  // Último recurso
  ];

  const handleImageError = () => {
    if (!fallbackChain) return;
    
    const currentIndex = fallbackSequence.indexOf(currentSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < fallbackSequence.length) {
      setCurrentSrc(fallbackSequence[nextIndex]);
    } else {
      setHasErrored(true);
    }
  };

  // Componente de fallback elegante si todo falla
  const ErrorFallback = () => (
    <div className={`${size === 'custom' ? customSize : sizeMap[size]} 
                     bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 
                     rounded-lg flex items-center justify-center text-white font-bold 
                     text-xs ${className}`}>
      MAIS
    </div>
  );

  if (hasErrored) {
    return <ErrorFallback />;
  }

  const logoElement = (
    <img
      src={currentSrc}
      alt="MAIS - Movimiento Alternativo Indígena y Social"
      className={`${size === 'custom' ? customSize : sizeMap[size]} 
                  object-contain ${className} cursor-pointer`}
      onError={handleImageError}
      onClick={onClick}
      loading="lazy"
    />
  );

  // Versión animada con Framer Motion
  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="transform-gpu will-change-transform"
      >
        {logoElement}
      </motion.div>
    );
  }

  return logoElement;
};

// Hook personalizado para gestión avanzada de logos
export const useMAISLogo = () => {
  const [logoVariant, setLogoVariant] = useState<'png' | 'ico' | 'svg'>('png');
  
  // Detectar mejor formato basado en capacidades del dispositivo
  const detectOptimalFormat = () => {
    const canvas = document.createElement('canvas');
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('webp') > -1;
    
    if (supportsWebP) return 'svg'; // SVG para mejor escalabilidad
    return 'png'; // PNG como backup universal
  };

  const optimizeForDevice = () => {
    const optimal = detectOptimalFormat();
    setLogoVariant(optimal as 'png' | 'ico' | 'svg');
  };

  return {
    logoVariant,
    setLogoVariant,
    optimizeForDevice
  };
};

export default MAISLogo;