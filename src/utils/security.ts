// UTILIDADES DE SEGURIDAD - MAIS POLITICAL PLATFORM
// Sistema integral de validación y sanitización

/**
 * VALIDACIÓN Y SANITIZACIÓN DE INPUTS
 * Previene XSS, SQL injection y otros ataques de inyección
 */

// LISTA NEGRA DE PATRONES PELIGROSOS
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload=/gi,
  /onclick=/gi,
  /onerror=/gi,
  /eval\(/gi,
  /expression\(/gi,
  /url\(/gi,
  /import\(/gi
];

// CARACTERES ESPECIALES PELIGROSOS
const SPECIAL_CHARS = /[<>'"&\x00-\x1F\x7F-\x9F]/g;

/**
 * Sanitiza texto de entrada eliminando contenido peligroso
 * @param input - Texto a sanitizar
 * @param strict - Modo estricto (por defecto: true)
 * @returns Texto sanitizado
 */
export const sanitizeText = (input: string, strict: boolean = true): string => {
  if (typeof input !== 'string') {
    throw new Error('❌ ERROR: Input debe ser una cadena de texto');
  }

  let sanitized = input;

  // PASO 1: Eliminar patrones peligrosos
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // PASO 2: Escapar caracteres especiales si está en modo estricto
  if (strict) {
    sanitized = sanitized.replace(SPECIAL_CHARS, '');
  } else {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // PASO 3: Normalizar espacios y caracteres de control
  sanitized = sanitized
    .replace(/\s+/g, ' ')
    .trim();

  return sanitized;
};

/**
 * Valida formato de email
 * @param email - Email a validar
 * @returns true si es válido
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valida contraseña segura
 * @param password - Contraseña a validar
 * @returns Objeto con resultado y detalles
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'débil' | 'media' | 'fuerte';
} => {
  const errors: string[] = [];
  let strength: 'débil' | 'media' | 'fuerte' = 'débil';

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }

  // EVALUACIÓN DE FORTALEZA
  if (errors.length === 0) {
    if (password.length >= 12 && /[A-Z].*[A-Z]/.test(password)) {
      strength = 'fuerte';
    } else {
      strength = 'media';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * Valida roles de usuario del sistema jerárquico MAIS
 * @param role - Rol a validar
 * @returns true si es válido
 */
export const validateUserRole = (role: string): boolean => {
  const validRoles = [
    'Comité Ejecutivo Nacional',
    'Líder Regional', 
    'Comité Departamental',
    'Candidato',
    'Influenciador Digital',
    'Líder Comunitario',
    'Votante/Simpatizante'
  ];
  return validRoles.includes(role);
};

/**
 * Genera hash seguro para datos sensibles
 * @param data - Datos a hashear
 * @returns Promise<string> Hash generado
 */
export const generateSecureHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Valida integridad de datos mediante checksum
 * @param data - Datos a verificar
 * @param expectedHash - Hash esperado
 * @returns Promise<boolean> true si es válido
 */
export const verifyDataIntegrity = async (
  data: string, 
  expectedHash: string
): Promise<boolean> => {
  const computedHash = await generateSecureHash(data);
  return computedHash === expectedHash;
};

/**
 * Rate limiting básico basado en localStorage
 * @param key - Clave para identificar la acción
 * @param maxAttempts - Máximo número de intentos
 * @param windowMs - Ventana de tiempo en millisegundos
 * @returns true si está dentro del límite
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify({
      attempts: 1,
      firstAttempt: now
    }));
    return true;
  }

  const { attempts, firstAttempt } = JSON.parse(stored);

  // Si ha pasado la ventana de tiempo, reiniciar
  if (now - firstAttempt > windowMs) {
    localStorage.setItem(storageKey, JSON.stringify({
      attempts: 1,
      firstAttempt: now
    }));
    return true;
  }

  // Si no ha superado el límite
  if (attempts < maxAttempts) {
    localStorage.setItem(storageKey, JSON.stringify({
      attempts: attempts + 1,
      firstAttempt
    }));
    return true;
  }

  return false;
};

/**
 * Limpia datos sensibles del almacenamiento local
 */
export const clearSensitiveData = (): void => {
  // PATRONES DE CLAVES SENSIBLES
  const sensitivePatterns = [
    /auth/i,
    /token/i,
    /session/i,
    /credential/i,
    /password/i,
    /key/i,
    /secret/i
  ];

  // LIMPIAR LOCALSTORAGE
  Object.keys(localStorage).forEach(key => {
    if (sensitivePatterns.some(pattern => pattern.test(key))) {
      localStorage.removeItem(key);
    }
  });

  // LIMPIAR SESSIONSTORAGE
  Object.keys(sessionStorage).forEach(key => {
    if (sensitivePatterns.some(pattern => pattern.test(key))) {
      sessionStorage.removeItem(key);
    }
  });

  console.log('🧹 Datos sensibles limpiados del almacenamiento');
};

/**
 * Detecta posibles ataques basados en patrones de entrada
 * @param input - Entrada a analizar
 * @returns Objeto con resultado del análisis
 */
export const detectSecurityThreat = (input: string): {
  isThreat: boolean;
  threatType: string[];
  riskLevel: 'bajo' | 'medio' | 'alto';
} => {
  const threats: string[] = [];
  let riskLevel: 'bajo' | 'medio' | 'alto' = 'bajo';

  // DETECCIÓN DE XSS
  if (/<script|javascript:|onload=|onclick=/i.test(input)) {
    threats.push('XSS');
    riskLevel = 'alto';
  }

  // DETECCIÓN DE SQL INJECTION
  if (/(union|select|insert|delete|update|drop|create|alter)\s/i.test(input)) {
    threats.push('SQL_INJECTION');
    riskLevel = 'alto';
  }

  // DETECCIÓN DE PATH TRAVERSAL
  if (/\.\.[\/\\]|[\/\\]\.\.[\/\\]/i.test(input)) {
    threats.push('PATH_TRAVERSAL');
    riskLevel = 'medio';
  }

  // DETECCIÓN DE COMMAND INJECTION
  if (/[;&|`$(){}[\]]/i.test(input)) {
    threats.push('COMMAND_INJECTION');
    riskLevel = riskLevel === 'alto' ? 'alto' : 'medio';
  }

  return {
    isThreat: threats.length > 0,
    threatType: threats,
    riskLevel
  };
};

// LOG DE INICIALIZACIÓN DEL MÓDULO DE SEGURIDAD
console.log('🛡️ Módulo de seguridad MAIS cargado correctamente');
console.log('📋 Funciones disponibles: sanitizeText, validateEmail, validatePassword, validateUserRole');
console.log('🔍 Detección de amenazas: XSS, SQL Injection, Path Traversal, Command Injection');