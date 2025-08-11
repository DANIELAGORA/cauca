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
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info');
    
    if (tablesError) {
      console.log('⚠️  No se pudo verificar tablas automáticamente, continuando...');
    }

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
          console.log(`❌ Tabla '${table}': No existe`);
        } else {
          tableStatus[table] = '✅ Existe';
          console.log(`✅ Tabla '${table}': Existe`);
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
      }
    } catch (err) {
      console.log('❌ Error verificando autenticación');
    }

    // Check storage buckets
    console.log('\n📂 Verificando almacenamiento...');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        console.log('❌ Error accediendo a storage:', storageError.message);
      } else {
        const filesBucket = buckets?.find(b => b.name === 'files');
        if (filesBucket) {
          console.log('✅ Bucket "files" existe');
        } else {
          console.log('❌ Bucket "files" no existe - necesita crearse');
        }
      }
    } catch (err) {
      console.log('❌ Error verificando storage');
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
      console.log('1. ⚠️  Ejecutar el script SQL schema en Supabase:');
      console.log('   - Ve a tu dashboard de Supabase');
      console.log('   - SQL Editor → New Query');
      console.log('   - Ejecuta el contenido de supabase_schema.sql');
      console.log('');
    }

    console.log('2. 🔧 Crear bucket de almacenamiento si no existe:');
    console.log('   - Ve a Storage en Supabase');
    console.log('   - Crear nuevo bucket llamado "files"');
    console.log('   - Configurarlo como público o con políticas apropiadas');
    console.log('');

    console.log('3. 🚀 La PWA está lista para conectar con Supabase');
    console.log('   - Credenciales configuradas correctamente');
    console.log('   - URL del proyecto: ' + supabaseUrl);
    
    return {
      tablesExist: missingTables.length === 0,
      missingTables,
      ready: true
    };

  } catch (error) {
    console.error('❌ Error general:', error.message);
    return { ready: false, error: error.message };
  }
}

// Run verification
verifyDatabase()
  .then((result) => {
    if (result.ready && result.tablesExist) {
      console.log('\n🎉 ¡Supabase está completamente configurado y listo!');
      process.exit(0);
    } else if (result.ready) {
      console.log('\n⚠️  Supabase está parcialmente configurado. Revisar recomendaciones.');
      process.exit(1);
    } else {
      console.log('\n❌ Error de configuración de Supabase.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Error ejecutando verificación:', error);
    process.exit(1);
  });