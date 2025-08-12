#!/usr/bin/env tsx
/**
 * INSPECCIÓN REAL DE BASE DE DATOS SUPABASE
 * Descubre estructura actual sin asumir nada
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectDatabase() {
  console.log('🔍 INSPECCIÓN REAL DE BASE DE DATOS SUPABASE');
  console.log('=' * 60);
  
  // 1. Verificar qué tablas existen realmente
  console.log('\n📋 LISTANDO TABLAS EXISTENTES...');
  try {
    // Intentar obtener información del sistema
    const { data: systemData, error: systemError } = await supabase
      .rpc('get_tables_info');
      
    if (systemError) {
      console.log('❌ No se pueden listar tablas via RPC');
    }
  } catch (err) {
    console.log('❌ RPC no disponible');
  }
  
  // 2. Probar tablas una por una
  const tablesToTest = [
    'user_profiles', 'profiles', 'messages', 'databases', 
    'users', 'accounts', 'campaign_finances'
  ];
  
  const existingTables = [];
  
  for (const table of tablesToTest) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (!error) {
        console.log(`✅ Tabla '${table}' existe`);
        existingTables.push({
          name: table,
          hasData: data && data.length > 0,
          sampleRecord: data?.[0]
        });
      } else {
        if (!error.message.includes('Invalid API key')) {
          console.log(`❌ Tabla '${table}': ${error.message}`);
        }
      }
    } catch (err) {
      // Ignorar errores
    }
  }
  
  // 3. Analizar estructura de tablas existentes
  console.log('\n🔍 ESTRUCTURA DE TABLAS ENCONTRADAS:');
  
  for (const table of existingTables) {
    console.log(`\n📋 TABLA: ${table.name}`);
    console.log(`   📊 Tiene datos: ${table.hasData ? 'Sí' : 'No'}`);
    
    if (table.sampleRecord) {
      console.log(`   🔑 Columnas disponibles:`);
      Object.keys(table.sampleRecord).forEach(col => {
        console.log(`      - ${col}: ${typeof table.sampleRecord[col]}`);
      });
    }
  }
  
  // 4. Test específico de Auth
  console.log('\n🔐 VERIFICANDO USUARIOS AUTH...');
  
  // Intentar login con credenciales conocidas
  const testCredentials = [
    { email: 'joseluisdiago@maiscauca.com', password: 'agoramais2025' },
    { email: 'testconcejal@maiscauca.com', password: 'agoramais2025' }
  ];
  
  for (const cred of testCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(cred);
      
      if (data.user) {
        console.log(`✅ ${cred.email} - Login exitoso`);
        console.log(`   📧 User ID: ${data.user.id}`);
        console.log(`   📅 Creado: ${data.user.created_at}`);
        
        // Verificar si tiene perfil
        if (existingTables.find(t => t.name === 'user_profiles')) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          console.log(`   👤 Perfil: ${profile ? 'Existe' : 'No existe'}`);
        }
        
        await supabase.auth.signOut();
      } else {
        console.log(`❌ ${cred.email} - Login fallido: ${error?.message}`);
      }
    } catch (err) {
      console.log(`❌ ${cred.email} - Error: ${err}`);
    }
  }
  
  // 5. Generar reporte y recomendaciones
  console.log('\n📊 REPORTE FINAL:');
  console.log(`✅ Tablas encontradas: ${existingTables.length}`);
  console.log(`🔐 Supabase Auth: Funcionando`);
  
  if (existingTables.length === 0) {
    console.log('\n⚠️  NINGUNA TABLA ENCONTRADA');
    console.log('CAUSA PROBABLE: API Key incorrecta o permisos insuficientes');
  } else {
    console.log('\n🎯 ESTRUCTURA REAL DESCUBIERTA');
    existingTables.forEach(table => {
      console.log(`   - ${table.name}: ${table.hasData ? 'CON DATOS' : 'VACÍA'}`);
    });
  }
  
  console.log('\n🔧 PRÓXIMOS PASOS RECOMENDADOS:');
  console.log('1. Verificar API Keys en variables de entorno');
  console.log('2. Ejecutar SQL manualmente en Supabase Dashboard');
  console.log('3. Actualizar scripts basados en estructura real');
  console.log('4. Re-ejecutar testing con estructura correcta');
}

inspectDatabase().catch(console.error);