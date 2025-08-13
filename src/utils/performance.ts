// UTILIDADES DE PERFORMANCE - MAIS POLITICAL PLATFORM
// Sistema integral de optimización de rendimiento

/**
 * LAZY LOADING Y CODE SPLITTING UTILITIES
 * Herramientas para mejorar los tiempos de carga
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// COMPONENTE DE LOADING OPTIMIZADO
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    <span className="ml-2 text-gray-600">Cargando...</span>
  </div>
);

// COMPONENTE DE ERROR OPTIMIZADO
export const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <div className="text-red-600 text-xl mb-2">⚠️ Error de carga</div>
    <p className="text-gray-600 text-center mb-4">
      Ha ocurrido un error al cargar este componente
    </p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Reintentar
    </button>
  </div>
);

/**
 * Función para lazy loading optimizado con retry automático
 * @param importFunc - Función de importación dinámica
 * @param retries - Número de reintentos (default: 3)
 * @returns LazyExoticComponent con manejo de errores
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries: number = 3
): LazyExoticComponent<T> => {
  return lazy(async () => {
    let lastError: Error;
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await importFunc();
      } catch (error) {
        lastError = error as Error;
        
        if (i < retries) {
          // Esperar un tiempo exponencial antes del retry
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
          console.warn(`🔄 Retry ${i + 1}/${retries} para cargar componente:`, error);
        }
      }
    }
    
    console.error('❌ Error definitivo cargando componente:', lastError);
    throw lastError;
  });
};

/**
 * DASHBOARDS LAZY LOADING - CARGA DIFERIDA POR ROL
 */
export const LazyDashboards = {
  National: lazyWithRetry(() => import('@components/dashboards/NationalDashboard')),
  Regional: lazyWithRetry(() => import('@components/dashboards/RegionalDashboard')),
  Departmental: lazyWithRetry(() => import('@components/dashboards/DepartmentalDashboard')),
  Candidate: lazyWithRetry(() => import('@components/dashboards/CandidateDashboard')),
  Influencer: lazyWithRetry(() => import('@components/dashboards/InfluencerDashboard')),
  Leader: lazyWithRetry(() => import('@components/dashboards/LeaderDashboard')),
  Voter: lazyWithRetry(() => import('@components/dashboards/VoterDashboard'))
};

/**
 * WIDGETS LAZY LOADING - CARGA BAJO DEMANDA
 */
export const LazyWidgets = {
  MessageCenter: lazyWithRetry(() => import('@components/widgets/MessageCenter')),
  MetricsGrid: lazyWithRetry(() => import('@components/widgets/MetricsGrid')),
  FileUpload: lazyWithRetry(() => import('@components/widgets/FileUpload')),
  UserManagement: lazyWithRetry(() => import('@components/widgets/UserManagement')),
  CuentasClaras: lazyWithRetry(() => import('@components/widgets/CuentasClaras')),
  TerritoryMap: lazyWithRetry(() => import('@components/widgets/TerritoryMap'))
};

/**
 * SISTEMA DE DEBOUNCING PARA INPUTS
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * VIRTUAL SCROLLING PARA LISTAS GRANDES
 * Optimización para listas de usuarios políticos
 */
export interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CACHE DE IMÁGENES OPTIMIZADO
 */
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Set<string>();

  async loadImage(src: string): Promise<HTMLImageElement> {
    // Si ya está en caché, devolver inmediatamente
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Si ya se está cargando, esperar
    if (this.loading.has(src)) {
      return new Promise((resolve) => {
        const checkCache = () => {
          if (this.cache.has(src)) {
            resolve(this.cache.get(src)!);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    // Comenzar nueva carga
    this.loading.add(src);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  clear() {
    this.cache.clear();
    this.loading.clear();
  }

  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size
    };
  }
}

export const imageCache = new ImageCache();

/**
 * HOOK PARA INTERSECTION OBSERVER (LAZY LOADING)
 */
export const useIntersectionObserver = (
  target: React.RefObject<Element>,
  onIntersect: () => void,
  threshold: number = 0.1
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold }
    );

    if (target.current) {
      observer.observe(target.current);
    }

    return () => observer.disconnect();
  }, [target, onIntersect, threshold]);
};

/**
 * COMPONENTE DE IMAGEN LAZY CON PLACEHOLDER
 */
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className, placeholder = '/placeholder.png' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useIntersectionObserver(
    imgRef,
    () => setIsInView(true),
    0.1
  );

  useEffect(() => {
    if (isInView && !isLoaded) {
      imageCache.loadImage(src)
        .then(() => setIsLoaded(true))
        .catch(() => console.error(`Error loading image: ${src}`));
    }
  }, [isInView, src, isLoaded]);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      loading="lazy"
    />
  );
};

/**
 * SISTEMA DE MÉTRICAS DE PERFORMANCE
 */
export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMetrics {
    if (!PerformanceMetrics.instance) {
      PerformanceMetrics.instance = new PerformanceMetrics();
    }
    return PerformanceMetrics.instance;
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure.duration;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Limpiar marcas
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
  }

  getAllMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [name, times] of this.metrics) {
      result[name] = {
        average: this.getAverageTime(name),
        count: times.length
      };
    }
    
    return result;
  }

  logMetrics(): void {
    console.group('📊 MÉTRICAS DE PERFORMANCE MAIS');
    const metrics = this.getAllMetrics();
    
    Object.entries(metrics).forEach(([name, data]) => {
      console.log(`${name}: ${data.average.toFixed(2)}ms (${data.count} muestras)`);
    });
    
    console.groupEnd();
  }
}

export const performanceMetrics = PerformanceMetrics.getInstance();

// IMPORTS NECESARIOS PARA LOS HOOKS
import { useState, useEffect, useRef } from 'react';

// LOG DE INICIALIZACIÓN
console.log('⚡ Sistema de optimización de performance MAIS cargado');
console.log('🚀 Funciones disponibles: lazy loading, debounce, virtual scroll, image cache');
console.log('📊 Métricas de performance activas');