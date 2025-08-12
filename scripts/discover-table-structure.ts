#!/usr/bin/env tsx
/**
 * DESCUBRIMIENTO DE ESTRUCTURA REAL DE TABLAS SUPABASE
 * Obtiene columnas exactas de cada tabla
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discoverTableStructure(tableName: string) {
  console.log(`\n🔍 DESCUBRIENDO ESTRUCTURA: ${tableName}`);
  
  try {
    // Método 1: Insertar registro vacío para descubrir columnas requeridas
    const { error: insertError } = await supabase
      .from(tableName)
      .insert({});
      
    if (insertError) {
      console.log(`   ❌ Insert vacío: ${insertError.message}`);
      
      // Extraer columnas requeridas del error
      if (insertError.message.includes('null value in column')) {
        const match = insertError.message.match(/null value in column "([^"]+)"/);
        if (match) {
          console.log(`   🔑 Columna requerida encontrada: ${match[1]}`);
        }
      }
    }
    
    // Método 2: Intentar diferentes estructuras comunes
    const commonFields = [
      { id: crypto.randomUUID() },
      { email: 'test@example.com' },
      { name: 'Test User' },
      { role: 'test' },
      { id: crypto.randomUUID(), email: 'test@example.com' },
      { id: crypto.randomUUID(), name: 'Test User' },
      { id: crypto.randomUUID(), email: 'test@example.com', name: 'Test User' }
    ];
    
    for (const fields of commonFields) {
      const { error } = await supabase
        .from(tableName)
        .insert(fields);
        
      if (!error) {
        console.log(`   ✅ Estructura válida encontrada:`, Object.keys(fields));
        
        // Limpiar el registro test
        await supabase
          .from(tableName)
          .delete()
          .match(fields);
          
        return Object.keys(fields);
      } else {
        console.log(`   ❌ Estructura fallida (${Object.keys(fields).join(', ')}): ${error.message}`);
      }
    }
    
    return null;
    
  } catch (err) {
    console.log(`   ❌ Error general: ${err}`);
    return null;
  }
}

async function generateWorkingScript() {
  console.log('🎯 GENERANDO SCRIPT FUNCIONAL BASADO EN ESTRUCTURA REAL');
  console.log('=' * 60);
  
  const tables = ['user_profiles', 'profiles'];
  const workingStructures: Record<string, string[]> = {};
  
  for (const table of tables) {
    const structure = await discoverTableStructure(table);
    if (structure) {
      workingStructures[table] = structure;
    }
  }
  
  console.log('\n📋 ESTRUCTURAS FUNCIONALES DESCUBIERTAS:');
  Object.entries(workingStructures).forEach(([table, fields]) => {
    console.log(`   ${table}: ${fields.join(', ')}`);
  });
  
  // Generar script fix basado en lo descubierto
  if (Object.keys(workingStructures).length > 0) {
    console.log('\n🛠️  SCRIPT FIX GENERADO:');
    console.log('\nEjecuta esto en tu código:');
    
    const fixScript = `
// SCRIPT FIX - BASADO EN ESTRUCTURA REAL DESCUBIERTA
const { data, error } = await supabase
  .from('${Object.keys(workingStructures)[0]}')
  .insert({
    ${workingStructures[Object.keys(workingStructures)[0]]?.map(field => 
      field === 'id' ? 'id: crypto.randomUUID(),' :
      field === 'email' ? 'email: userData.email,' :
      field === 'name' ? 'name: userData.name,' :
      field === 'role' ? 'role: userData.role,' :
      `${field}: userData.${field} || null,`
    ).join('\n    ') || ''}
  });`;
    
    console.log(fixScript);
  } else {
    console.log('\n❌ NO SE ENCONTRARON ESTRUCTURAS FUNCIONALES');
    console.log('REVISAR PERMISOS O CONFIGURACIÓN DE SUPABASE');
  }
}

generateWorkingScript().catch(console.error);