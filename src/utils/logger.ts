/**
 * Sistema de logging optimizado para producción
 * Elimina console statements en modo producción automáticamente
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Límite para evitar memory leaks

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  private addLog(entry: LogEntry) {
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift(); // Eliminar el más antiguo
    }
    this.logs.push(entry);
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.log(`🔍 ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  }

  error(message: string, error?: any) {
    const entry = this.createLogEntry('error', message, error);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.error(`❌ ${message}`, error || '');
    }
    
    // En producción, enviar errores críticos a servicio de monitoreo si está configurado
    if (!this.isDevelopment && error && error.critical) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Implementar integración con servicio de monitoreo (ej: Sentry, LogRocket)
    // Solo para errores críticos en producción
    try {
      // Placeholder para integración futura
      // console.error('Critical error:', entry);
    } catch (err) {
      // Silencioso en producción para evitar loops
    }
  }

  // Método para obtener logs en desarrollo
  getLogs(): LogEntry[] {
    return this.isDevelopment ? [...this.logs] : [];
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
  }
}

// Instancia singleton
export const logger = new Logger();

// Shorthand exports para facilitar migración
export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logError = (message: string, error?: any) => logger.error(message, error);