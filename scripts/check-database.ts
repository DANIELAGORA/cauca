#!/usr/bin/env tsx
/**
 * SCRIPT DE VERIFICACIÓN DE BASE DE DATOS SUPABASE
 * Revisa estructura actual y sugiere correcciones
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZUhhbm0iOiJhbm9uIiwiaWF0IjoxNzU0OTMwMTc2LCJleHAiOjIwNzA1MDYxNzZ9.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE BASE DE DATOS');
  console.log('=' * 50);
  
  // Lista de tablas a verificar
  const tablesToCheck = [
    'user_profiles', 
    'profiles', 
    'messages', 
    'databases',
    'campaign_finances'
  ];
  
  for (const table of tablesToCheck) {
    console.log(`\n📋 Verificando tabla: ${table}`);
    
    try {
      // Intentar obtener estructura de la tabla
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
        
        if (error.message.includes('does not exist')) {
          console.log(`  💡 La tabla ${table} no existe`);
        }
      } else {
        console.log(`  ✅ Tabla ${table} existe`);
        console.log(`  📊 Registros encontrados: ${data?.length || 0}`);
        
        if (data && data.length > 0) {
          console.log(`  🔑 Columnas disponibles:`, Object.keys(data[0]));
        }
      }
    } catch (err) {
      console.log(`  ❌ Error general: ${err}`);
    }
  }
}

async function testAuth() {
  console.log('\n🔐 VERIFICANDO AUTENTICACIÓN');
  console.log('=' * 50);
  
  try {
    // Verificar si podemos obtener la sesión actual
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`❌ Error obteniendo sesión: ${error.message}`);
    } else {
      console.log(`✅ Auth funcionando correctamente`);
      console.log(`📊 Usuario actual: ${session.session?.user?.email || 'Ninguno'}`);
    }
    
    // Verificar usuarios existentes (si tenemos permisos)
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (users && !usersError) {
      console.log(`👥 Total usuarios registrados: ${users.users.length}`);
    }
    
  } catch (err) {
    console.log(`❌ Error en verificación de Auth: ${err}`);
  }
}

function generateFixSQL() {
  console.log('\n🛠️  SQL PARA CORREGIR BASE DE DATOS');
  console.log('=' * 50);
  console.log('Ejecuta este SQL en Supabase SQL Editor:');
  console.log('');
  
  const sql = `
-- 1. Crear tabla user_profiles si no existe
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ciudadano-base',
    municipality TEXT,
    department TEXT DEFAULT 'Cauca',
    region TEXT DEFAULT 'Cauca', 
    phone TEXT,
    position TEXT,
    election_date DATE,
    es_real_electo BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla messages si no existe
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_name TEXT,
    sender_role TEXT,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'direct', -- direct, broadcast, hierarchical
    priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    read_by UUID[] DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla databases si no existe  
CREATE TABLE IF NOT EXISTS databases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- excel, image, document
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    territory TEXT,
    category TEXT,
    url TEXT,
    metadata JSONB DEFAULT '{}',
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;  
ALTER TABLE databases ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS básicas
-- user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own profile" ON user_profiles  
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profile" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- messages  
CREATE POLICY "Users can view messages" ON messages
    FOR SELECT USING (true);
    
CREATE POLICY "Users can insert messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- databases
CREATE POLICY "Users can view databases" ON databases  
    FOR SELECT USING (true);
    
CREATE POLICY "Users can insert databases" ON databases
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- 6. Crear storage bucket para archivos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Política para storage bucket
CREATE POLICY "Anyone can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'files');

CREATE POLICY "Anyone can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'files');
`;
  
  console.log(sql);
  console.log('\n' + '=' * 50);
  console.log('Después de ejecutar el SQL, ejecuta: npm run test:production');
}

async function main() {
  console.log('🎯 MAIS CAUCA - DIAGNÓSTICO DE BASE DE DATOS');
  
  await checkTables();
  await testAuth();
  generateFixSQL();
}

main().catch(console.error);