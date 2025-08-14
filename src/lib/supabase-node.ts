// SUPABASE CLIENT FOR NODE.JS ENVIRONMENT
// Para uso en scripts de testing y procesos de Node.js

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// CONFIGURACIÓN PARA NODE.JS
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// VALIDACIÓN ESTRICTA
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR CRÍTICO: Variables de entorno Supabase no encontradas');
  console.error('🔧 Variables requeridas:');
  console.error('   - VITE_SUPABASE_URL o SUPABASE_URL');
  console.error('   - VITE_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY');
  throw new Error('Variables de entorno Supabase requeridas para testing');
}

console.log('🔧 Configurando Supabase cliente para Node.js...');
console.log('🌐 URL:', supabaseUrl ? 'Configurada ✅' : 'Faltante ❌');
console.log('🔑 API Key:', supabaseAnonKey ? 'Configurada ✅' : 'Faltante ❌');

// CLIENTE OPTIMIZADO PARA NODE.JS
export const supabaseNode = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // No persistir en Node.js
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: false
  },
  global: {
    headers: {
      'X-Client-Info': 'mais-testing-suite',
      'X-Client-Version': '2.1.0'
    }
  }
});

console.log('✅ Cliente Supabase para Node.js inicializado correctamente');

export default supabaseNode;