// SISTEMA DE LOGGING OPTIMIZADO MAIS - SIN ERRORES
// Logger profesional para producción

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogData = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: LogData;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: LogData, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const timeStr = new Date(timestamp).toLocaleTimeString();
    const contextStr = context ? `[${context}]` : '';
    return `${timeStr} ${level.toUpperCase()} ${contextStr} ${message}`;
  }

  private addToHistory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  public info(message: string, data?: LogData, context?: string): void {
    const entry = this.createLogEntry('info', message, data, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.log(this.formatMessage(entry), data || '');
    }
  }

  public warn(message: string, data?: LogData, context?: string): void {
    const entry = this.createLogEntry('warn', message, data, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.warn(this.formatMessage(entry), data || '');
    }
  }

  public error(message: string, data?: LogData, context?: string): void {
    const entry = this.createLogEntry('error', message, data, context);
    this.addToHistory(entry);
    
    console.error(this.formatMessage(entry), data || '');
  }

  public debug(message: string, data?: LogData, context?: string): void {
    const entry = this.createLogEntry('debug', message, data, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry), data || '');
    }
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public downloadLogs(): void {
    try {
      const logData = JSON.stringify(this.logs, null, 2);
      const blob = new Blob([logData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `mais-logs-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  }

  public getLogStats(): { total: number; byLevel: Record<LogLevel, number> } {
    const stats = {
      total: this.logs.length,
      byLevel: { info: 0, warn: 0, error: 0, debug: 0 } as Record<LogLevel, number>
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level]++;
    });

    return stats;
  }
}

// Instancia singleton
const logger = new Logger();

// Exports simplificados
export const logInfo = (message: string, data?: LogData, context?: string): void => {
  logger.info(message, data, context);
};

export const logWarn = (message: string, data?: LogData, context?: string): void => {
  logger.warn(message, data, context);
};

export const logError = (message: string, data?: LogData, context?: string): void => {
  logger.error(message, data, context);
};

export const logDebug = (message: string, data?: LogData, context?: string): void => {
  logger.debug(message, data, context);
};

export const getLogs = (level?: LogLevel): LogEntry[] => {
  return logger.getLogs(level);
};

export const clearLogs = (): void => {
  logger.clearLogs();
};

export const downloadLogs = (): void => {
  logger.downloadLogs();
};

export const getLogStats = (): { total: number; byLevel: Record<LogLevel, number> } => {
  return logger.getLogStats();
};

export { Logger };
export type { LogLevel, LogData, LogEntry };