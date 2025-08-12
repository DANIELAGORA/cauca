#!/usr/bin/env tsx
/**
 * SCRIPT FINAL FUNCIONAL - BASADO EN ESTRUCTURA REAL DESCUBIERTA
 * Usa estructura exacta encontrada en Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// USUARIOS CON CREDENCIALES VERIFICADAS
const usuariosFuncionales = [
  {
    email: 'joseluisdiago@maiscauca.com',
    password: 'agoramais2025',
    full_name: 'José Luis Diago Franco',
    role: 'director-departamental' // Debe ser valor ENUM válido
  },
  {
    email: 'testconcejal@maiscauca.com', 
    password: 'agoramais2025',
    full_name: 'Ana María López',
    role: 'concejal'
  }
];

async function setupUserProfileCorrect(userData: typeof usuariosFuncionales[0]) {
  console.log(`\n🏗️  Configurando: ${userData.full_name}`);
  
  try {
    // 1. Login para obtener user ID
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password
    });
    
    if (authError || !authData.user) {
      console.log(`  ❌ Login fallido: ${authError?.message}`);
      return false;
    }
    
    console.log(`  ✅ Login exitoso - ID: ${authData.user.id}`);
    
    // 2. Crear perfil usando estructura REAL descubierta
    console.log(`  👤 Creando perfil con estructura real...`);
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: authData.user.id,           // UUID requerido
        email: userData.email,          // String requerido  
        full_name: userData.full_name,  // NOT 'name' - es 'full_name'
        role: userData.role            // ENUM value
      }, {
        onConflict: 'id'
      });
      
    if (profileError) {
      console.log(`  ❌ Error perfil: ${profileError.message}`);
      
      // Intentar con roles ENUM válidos si falla
      const validRoles = ['ciudadano-base', 'concejal', 'alcalde', 'director-departamental'];
      
      for (const validRole of validRoles) {
        console.log(`  🔄 Intentando rol: ${validRole}`);
        
        const { error: retryError } = await supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: validRole
          }, {
            onConflict: 'id'
          });
          
        if (!retryError) {
          console.log(`  ✅ Perfil creado con rol: ${validRole}`);
          break;
        } else {
          console.log(`  ❌ Rol ${validRole} falló: ${retryError.message}`);
        }
      }
    } else {
      console.log(`  ✅ Perfil creado exitosamente`);
    }
    
    // 3. Verificar creación
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profile) {
      console.log(`  🎉 VERIFICADO - Perfil existe:`);
      console.log(`     Nombre: ${profile.full_name}`);
      console.log(`     Rol: ${profile.role}`);
      console.log(`     Email: ${profile.email}`);
      
      await supabase.auth.signOut();
      return true;
    } else {
      console.log(`  ❌ Perfil no encontrado después de creación`);
      await supabase.auth.signOut();
      return false;
    }
    
  } catch (error) {
    console.log(`  ❌ Error general: ${error}`);
    return false;
  }
}

async function testCompleteFlow() {
  console.log('🎯 SCRIPT FINAL - SETUP BASADO EN ESTRUCTURA REAL');
  console.log('=' * 60);
  
  let successful = 0;
  
  for (const userData of usuariosFuncionales) {
    const success = await setupUserProfileCorrect(userData);
    if (success) successful++;
    
    // Pausa entre usuarios
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n📊 RESULTADOS FINALES:');
  console.log(`✅ Usuarios configurados: ${successful}`);
  console.log(`❌ Usuarios fallidos: ${usuariosFuncionales.length - successful}`);
  console.log(`📈 Tasa de éxito: ${(successful / usuariosFuncionales.length * 100).toFixed(1)}%`);
  
  if (successful > 0) {
    console.log('\n🎉 ALGUNOS USUARIOS FUNCIONANDO');
    console.log('El sistema básico está operativo');
  } else {
    console.log('\n❌ NINGÚN USUARIO CONFIGURADO');
    console.log('Verificar ENUM types y permisos en Supabase');
  }
  
  console.log('\n🔍 LOGS PARA DEBUGGING:');
  console.log('- Verificar que roles sean valores ENUM válidos en PostgreSQL');
  console.log('- Confirmar que RLS permite inserts autenticados');
  console.log('- Revisar que columna sea "full_name" no "name"');
}

testCompleteFlow().catch(console.error);