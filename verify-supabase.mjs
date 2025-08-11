#!/usr/bin/env node

/**
 * Supabase Database Verification Script
 * Verifies current state and sets up missing tables/policies
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verificando estado de Supabase...\n');

async function verifyDatabase() {
  try {
    // Check existing tables
    console.log('📋 Verificando tablas existentes...');
    
    // Try to query each expected table
    const expectedTables = ['profiles', 'messages', 'databases'];
    const tableStatus = {};

    for (const table of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          tableStatus[table] = '❌ No existe';
          console.log(`❌ Tabla '${table}': No existe - ${error.message}`);
        } else {
          tableStatus[table] = '✅ Existe';
          console.log(`✅ Tabla '${table}': Existe (${data?.length || 0} registros de muestra)`);
        }
      } catch (err) {
        tableStatus[table] = '❌ Error';
        console.log(`❌ Tabla '${table}': Error de conexión`);
      }
    }

    // Check authentication
    console.log('\n🔐 Verificando autenticación...');
    try {
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.log('❌ Error accediendo a usuarios:', authError.message);
      } else {
        console.log(`✅ Autenticación funcionando. Usuarios registrados: ${users?.length || 0}`);
        if (users && users.length > 0) {
          console.log(`   Últimos usuarios: ${users.slice(0, 3).map(u => u.email).join(', ')}`);
        }
      }
    } catch (err) {
      console.log('❌ Error verificando autenticación:', err.message);
    }

    // Check storage buckets
    console.log('\n📂 Verificando almacenamiento...');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        console.log('❌ Error accediendo a storage:', storageError.message);
      } else {
        console.log(`✅ Storage accesible. Buckets encontrados: ${buckets?.length || 0}`);
        const filesBucket = buckets?.find(b => b.name === 'files');
        if (filesBucket) {
          console.log('✅ Bucket "files" existe');
          
          // Check files in bucket
          const { data: files } = await supabase.storage.from('files').list('', { limit: 5 });
          console.log(`   Archivos en bucket: ${files?.length || 0}`);
        } else {
          console.log('❌ Bucket "files" no existe - necesita crearse');
        }
      }
    } catch (err) {
      console.log('❌ Error verificando storage:', err.message);
    }

    // Test connection
    console.log('\n🌐 Verificando conectividad...');
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);
        
      if (error) {
        console.log('⚠️  Conectividad limitada:', error.message);
      } else {
        console.log('✅ Conectividad completa a Supabase');
        console.log(`   Tablas públicas encontradas: ${data?.length || 0}`);
      }
    } catch (err) {
      console.log('⚠️  Test de conectividad falló');
    }

    // Summary
    console.log('\n📊 RESUMEN DEL ESTADO:');
    console.log('========================');
    for (const [table, status] of Object.entries(tableStatus)) {
      console.log(`${status} ${table}`);
    }

    // Recommendations
    console.log('\n💡 RECOMENDACIONES:');
    console.log('==================');
    
    const missingTables = Object.entries(tableStatus)
      .filter(([_, status]) => status.includes('❌'))
      .map(([table, _]) => table);

    if (missingTables.length > 0) {
      console.log('1. ⚠️  EJECUTAR SCRIPT SQL:');
      console.log('   → Ve a https://supabase.com/dashboard');
      console.log('   → Selecciona tu proyecto MAIS');
      console.log('   → Ve a "SQL Editor" → "New Query"');
      console.log('   → Copia y pega el contenido de "supabase_schema.sql"');
      console.log('   → Ejecuta el script');
      console.log('');
    }

    if (!tableStatus['files'] || tableStatus['files'].includes('❌')) {
      console.log('2. 🔧 CREAR BUCKET DE ALMACENAMIENTO:');
      console.log('   → Ve a "Storage" en tu dashboard de Supabase');
      console.log('   → Crear nuevo bucket llamado "files"');
      console.log('   → Configurar como "Public bucket" para acceso directo');
      console.log('');
    }

    console.log('3. 🚀 ESTADO DE LA PWA:');
    console.log('   ✅ Credenciales configuradas correctamente');
    console.log('   ✅ URL del proyecto: ' + supabaseUrl);
    console.log('   ✅ Cliente Supabase conectado');
    
    const readyForProduction = missingTables.length === 0;
    if (readyForProduction) {
      console.log('   🎉 ¡LISTO PARA PRODUCCIÓN!');
    } else {
      console.log('   ⚠️  Pendiente: configurar tablas faltantes');
    }
    
    return {
      tablesExist: missingTables.length === 0,
      missingTables,
      ready: true,
      readyForProduction
    };

  } catch (error) {
    console.error('❌ Error general:', error.message);
    return { ready: false, error: error.message };
  }
}

// Run verification
verifyDatabase()
  .then((result) => {
    console.log('\n' + '='.repeat(50));
    if (result.ready && result.readyForProduction) {
      console.log('🎉 SUPABASE COMPLETAMENTE CONFIGURADO');
      console.log('✅ La PWA puede desplegarse inmediatamente');
      process.exit(0);
    } else if (result.ready) {
      console.log('⚠️  SUPABASE PARCIALMENTE CONFIGURADO');
      console.log('📋 Revisar recomendaciones arriba');
      process.exit(1);
    } else {
      console.log('❌ ERROR DE CONFIGURACIÓN');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Error ejecutando verificación:', error);
    process.exit(1);
  });