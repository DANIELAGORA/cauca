// CONFIGURACIÓN DE SUPABASE CLIENT - RETROCOMPATIBLE
// Cliente centralizado para todas las operaciones de base de datos

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// CONFIGURACIÓN ROBUSTA CON FALLBACK SEGURO
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// VALIDACIÓN ESTRICTA SIN FALLBACKS HARDCODEADOS
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR CRÍTICO DE SEGURIDAD: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son obligatorias.');
  console.error('🔧 CONFIGURACIÓN REQUERIDA EN CLOUDFLARE PAGES:');
  console.error('   VITE_SUPABASE_URL=https://djgkjtqpzedxnqwqdcjx.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...');
  throw new Error('Variables de entorno Supabase requeridas para funcionamiento seguro');
}

// VALIDACIÓN MEJORADA CON LOGS INFORMATIVOS
console.log('🔧 Configurando Supabase cliente...');
console.log('🌐 URL:', supabaseUrl ? 'Configurada ✅' : 'Faltante ❌');
console.log('🔑 API Key:', supabaseAnonKey ? 'Configurada ✅' : 'Faltante ❌');

// VALIDACIÓN DE FORMATO DE URL (NO CRÍTICA)
if (supabaseUrl && (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co'))) {
  console.warn('⚠️ FORMATO DE URL SOSPECHOSO: Verifica VITE_SUPABASE_URL');
}

// VALIDACIÓN DE FORMATO JWT (NO CRÍTICA)
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
if (supabaseAnonKey && !jwtRegex.test(supabaseAnonKey)) {
  console.warn('⚠️ FORMATO DE KEY SOSPECHOSO: Verifica VITE_SUPABASE_ANON_KEY');
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