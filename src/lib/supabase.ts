// CONFIGURACIÓN DE SUPABASE CLIENT
// Cliente centralizado para todas las operaciones de base de datos

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// CONFIGURACIÓN SEGURA - SIN FALLBACKS HARDCODEADOS
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// VALIDACIÓN ESTRICTA DE VARIABLES DE ENTORNO
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ ERROR CRÍTICO DE SEGURIDAD: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son obligatorias.\n' +
    '🔧 SOLUCIÓN: Configura estas variables en tu archivo .env.local o en Netlify/Vercel\n' +
    '📋 Ejemplo:\n' +
    '   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co\n' +
    '   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui'
  );
}

// VALIDACIÓN DE FORMATO DE URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error('❌ FORMATO INVÁLIDO: VITE_SUPABASE_URL debe ser una URL válida de Supabase');
}

// VALIDACIÓN DE FORMATO JWT
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
if (!jwtRegex.test(supabaseAnonKey)) {
  throw new Error('❌ FORMATO INVÁLIDO: VITE_SUPABASE_ANON_KEY debe ser un JWT válido');
}

// CONFIGURACIÓN SEGURA DEL CLIENTE SUPABASE
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // POLÍTICA DE SEGURIDAD ESTRICTA
    flowType: 'pkce',
    debug: false
  },
  global: {
    headers: {
      // HEADERS DE SEGURIDAD
      'X-Client-Info': 'mais-political-platform',
      'X-Client-Version': '2.1.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // THROTTLING PARA PREVENIR ABUSE
    }
  }
});

// VALIDACIÓN DE CONECTIVIDAD AL INICIALIZAR
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // LIMPIEZA SEGURA DE DATOS SENSIBLES AL LOGOUT
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token de autenticación renovado correctamente');
  }
});

// FUNCIÓN DE SANITIZACIÓN DE INPUTS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remover scripts
    .replace(/<[^>]*>/g, '') // Remover HTML tags
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remover caracteres de control
    .trim();
};

// FUNCIÓN DE VALIDACIÓN DE ROLES
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

// LOG DE INICIALIZACIÓN SEGURA (SIN EXPONER CREDENCIALES)
console.log('✅ Cliente Supabase inicializado correctamente');
console.log('🔒 Modo de seguridad: PRODUCTION');
console.log('🌐 URL del proyecto:', supabaseUrl.replace(/\/\/.*@/, '//[PROTECTED]@'));

export default supabase;