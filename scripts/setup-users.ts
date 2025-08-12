#!/usr/bin/env tsx
/**
 * SCRIPT DE CONFIGURACIÓN DE USUARIOS MAIS CAUCA
 * Crea usuarios reales en Supabase Auth y sus perfiles
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// USUARIOS REALES MAIS CAUCA
const usuariosReales = [
  {
    email: 'joseluisdiago@maiscauca.com',
    password: 'agoramais2025',
    name: 'José Luis Diago Franco',
    role: 'director-departamental',
    municipality: 'Popayán',
    phone: '3104015537'
  },
  {
    email: 'gelmischate@maiscauca.com',
    password: 'agoramais2025',
    name: 'Gelmis Chate Rivera',
    role: 'alcalde',
    municipality: 'Inzá',
    phone: '3225382560'
  },
  {
    email: 'testconcejal@maiscauca.com',
    password: 'agoramais2025',
    name: 'Ana María López',
    role: 'concejal',
    municipality: 'Popayán',
    phone: '3001234567'
  }
];

async function setupUser(userData: typeof usuariosReales[0]) {
  console.log(`\n🏗️  Configurando usuario: ${userData.name}`);
  
  try {
    // 1. Crear usuario en Auth
    console.log('  📝 Creando en Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError && !authError.message.includes('already registered')) {
      console.log(`  ❌ Error en Auth: ${authError.message}`);
      return false;
    }

    if (authData.user || authError?.message.includes('already registered')) {
      console.log('  ✅ Usuario creado/existe en Auth');
      
      // 2. Crear perfil (intentar con diferentes estructuras de tabla)
      console.log('  👤 Creando perfil...');
      
      // Primero intentar con estructura básica
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            email: userData.email,
            name: userData.name,
            role: userData.role,
            municipality: userData.municipality,
            department: 'Cauca',
            region: 'Cauca',
            phone: userData.phone,
            es_real_electo: true,
          }, {
            onConflict: 'email'
          });

        if (profileError) {
          console.log(`  ❌ Error creando perfil básico: ${profileError.message}`);
          
          // Intentar con estructura mínima
          const { error: minimalError } = await supabase
            .from('user_profiles')
            .upsert({
              email: userData.email,
              name: userData.name,
              role: userData.role,
            }, {
              onConflict: 'email'
            });
            
          if (minimalError) {
            console.log(`  ❌ Error con perfil mínimo: ${minimalError.message}`);
            return false;
          }
        }
        
        console.log('  ✅ Perfil creado exitosamente');
        return true;
        
      } catch (err) {
        console.log(`  ❌ Error general en perfil: ${err}`);
        return false;
      }
    }
    
  } catch (error) {
    console.log(`  ❌ Error general: ${error}`);
    return false;
  }
}

async function checkTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLAS...');
  
  try {
    // Verificar si existe la tabla user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log(`❌ Error accediendo user_profiles: ${error.message}`);
      
      // Intentar con profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (profilesError) {
        console.log(`❌ Error accediendo profiles: ${profilesError.message}`);
        console.log('📋 NECESITAS CREAR LA TABLA user_profiles EN SUPABASE');
        return false;
      } else {
        console.log('✅ Tabla profiles encontrada');
        return 'profiles';
      }
    } else {
      console.log('✅ Tabla user_profiles encontrada');
      return 'user_profiles';
    }
  } catch (err) {
    console.log(`❌ Error verificando tablas: ${err}`);
    return false;
  }
}

async function createTable() {
  console.log('🏗️  CREANDO TABLA user_profiles...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      municipality TEXT,
      department TEXT DEFAULT 'Cauca',
      region TEXT DEFAULT 'Cauca',
      phone TEXT,
      es_real_electo BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Habilitar RLS
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Política básica de RLS
    CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING (auth.uid() = id);
      
    CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE USING (auth.uid() = id);
  `;
  
  console.log('SQL para ejecutar manualmente en Supabase:');
  console.log(createTableSQL);
}

async function main() {
  console.log('🎯 MAIS CAUCA - CONFIGURACIÓN DE USUARIOS');
  console.log('=' * 50);
  
  // Verificar estructura de tablas
  const tableCheck = await checkTableStructure();
  
  if (!tableCheck) {
    await createTable();
    console.log('\n❌ Debes crear la tabla user_profiles en Supabase primero');
    console.log('Ve al SQL Editor en Supabase y ejecuta el SQL mostrado arriba');
    return;
  }
  
  console.log('\n🚀 CONFIGURANDO USUARIOS...');
  
  let successful = 0;
  for (const userData of usuariosReales) {
    const success = await setupUser(userData);
    if (success) successful++;
    
    // Pausa entre usuarios
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 RESUMEN FINAL:');
  console.log(`✅ Usuarios configurados: ${successful}`);
  console.log(`❌ Usuarios fallidos: ${usuariosReales.length - successful}`);
  console.log(`📈 Tasa de éxito: ${(successful / usuariosReales.length * 100).toFixed(1)}%`);
  
  if (successful === usuariosReales.length) {
    console.log('\n🎉 TODOS LOS USUARIOS CONFIGURADOS CORRECTAMENTE');
    console.log('Ya puedes ejecutar: npm run test:users');
  } else {
    console.log('\n🔧 REVISA LOS ERRORES Y VUELVE A EJECUTAR');
  }
}

main().catch(console.error);