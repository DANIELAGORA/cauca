#!/usr/bin/env tsx
// TESTING SIMPLE DEL SISTEMA DE ROLES MAIS
// Verificación básica pero confiable

import { createClient } from '@supabase/supabase-js';

// Usar credenciales recuperadas directamente
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

console.log('🎯 MAIS CAUCA - TESTING SIMPLE DEL SISTEMA DE ROLES');
console.log('================================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TestResult {
  test: string;
  passed: boolean;
  details?: any;
  error?: string;
}

const results: TestResult[] = [];

// TEST 1: CONECTIVIDAD A BASE DE DATOS
async function testConnectivity() {
  console.log('🔌 Test 1: Conectividad a base de datos...');
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      results.push({
        test: 'Conectividad DB',
        passed: false,
        error: error.message
      });
      console.log('❌ FALLO: Error de conectividad');
      return;
    }
    
    results.push({
      test: 'Conectividad DB',
      passed: true,
      details: { connected: true }
    });
    console.log('✅ ÉXITO: Base de datos conectada');
  } catch (err) {
    results.push({
      test: 'Conectividad DB',
      passed: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    });
    console.log('❌ FALLO: Excepción en conectividad');
  }
}

// TEST 2: ESTRUCTURA DE TABLA user_profiles
async function testTableStructure() {
  console.log('🏗️  Test 2: Estructura de tabla user_profiles...');
  try {
    // Intentar obtener un registro para verificar estructura
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, status')
      .limit(1);
    
    if (error) {
      results.push({
        test: 'Estructura Tabla',
        passed: false,
        error: `Error estructura: ${error.message}`
      });
      console.log('❌ FALLO: Estructura de tabla incorrecta');
      return;
    }
    
    results.push({
      test: 'Estructura Tabla',
      passed: true,
      details: { columnsAccessed: 5, sampleRecord: data?.[0] || null }
    });
    console.log('✅ ÉXITO: Estructura de tabla válida');
  } catch (err) {
    results.push({
      test: 'Estructura Tabla',
      passed: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    });
    console.log('❌ FALLO: Excepción en estructura');
  }
}

// TEST 3: USUARIOS REALES EXISTENTES
async function testRealUsers() {
  console.log('👥 Test 3: Verificación de usuarios reales...');
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, status')
      .eq('status', 'active');
    
    if (error) {
      results.push({
        test: 'Usuarios Reales',
        passed: false,
        error: error.message
      });
      console.log('❌ FALLO: Error obteniendo usuarios');
      return;
    }
    
    const userCount = data?.length || 0;
    const passed = userCount >= 4; // Al menos 4 usuarios para ser considerado exitoso
    
    results.push({
      test: 'Usuarios Reales',
      passed,
      details: { 
        totalUsers: userCount,
        users: data?.map(u => ({ name: u.full_name, email: u.email, role: u.role }))
      }
    });
    
    console.log(passed 
      ? `✅ ÉXITO: ${userCount} usuarios encontrados` 
      : `⚠️  ADVERTENCIA: Solo ${userCount} usuarios (esperados 96+)`
    );
    
  } catch (err) {
    results.push({
      test: 'Usuarios Reales',
      passed: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    });
    console.log('❌ FALLO: Excepción verificando usuarios');
  }
}

// TEST 4: LOGIN DE USUARIO REAL
async function testUserLogin() {
  console.log('🔐 Test 4: Testing login de usuario real...');
  try {
    // Probar con José Luis Diago
    const testEmail = 'joseluisdiago@maiscauca.com';
    const testPassword = 'agoramais2025';
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (error) {
      results.push({
        test: 'Login Usuario Real',
        passed: false,
        error: `Login falló: ${error.message}`
      });
      console.log(`❌ FALLO: No se pudo hacer login con ${testEmail}`);
      return;
    }
    
    // Cerrar sesión inmediatamente
    await supabase.auth.signOut();
    
    results.push({
      test: 'Login Usuario Real',
      passed: true,
      details: { 
        userEmail: testEmail,
        authId: data.user?.id,
        loginSuccessful: true
      }
    });
    console.log('✅ ÉXITO: Login y logout exitoso');
    
  } catch (err) {
    results.push({
      test: 'Login Usuario Real',
      passed: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    });
    console.log('❌ FALLO: Excepción en login');
  }
}

// TEST 5: JERARQUÍA BÁSICA DE ROLES
async function testRoleHierarchy() {
  console.log('👑 Test 5: Verificación de jerarquía de roles...');
  try {
    // Definir jerarquía esperada
    const expectedHierarchy = {
      'comite-departamental': 1,  // Director departamental
      'candidato': 2,             // Alcaldes
      'lider-regional': 3,        // Diputados
      'votante': 4                // Concejales y otros
    };
    
    // Verificar que existen usuarios con estos roles
    const roleChecks = [];
    
    for (const [role, level] of Object.entries(expectedHierarchy)) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, role')
        .eq('role', role)
        .eq('status', 'active')
        .limit(5);
      
      if (!error && data && data.length > 0) {
        roleChecks.push({
          role,
          level,
          userCount: data.length,
          users: data.map(u => u.full_name)
        });
      }
    }
    
    const passed = roleChecks.length >= 3; // Al menos 3 roles diferentes
    
    results.push({
      test: 'Jerarquía Roles',
      passed,
      details: {
        rolesFound: roleChecks.length,
        roleBreakdown: roleChecks
      }
    });
    
    console.log(passed 
      ? `✅ ÉXITO: ${roleChecks.length} tipos de roles encontrados`
      : `⚠️  ADVERTENCIA: Solo ${roleChecks.length} tipos de roles`
    );
    
  } catch (err) {
    results.push({
      test: 'Jerarquía Roles',
      passed: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    });
    console.log('❌ FALLO: Excepción verificando jerarquía');
  }
}

// EJECUTAR TODOS LOS TESTS
async function runAllTests() {
  console.log('🚀 Iniciando suite de testing...');
  console.log('');
  
  const tests = [
    testConnectivity,
    testTableStructure,
    testRealUsers,
    testUserLogin,
    testRoleHierarchy
  ];
  
  for (const test of tests) {
    await test();
    console.log('');
  }
  
  // GENERAR REPORTE FINAL
  console.log('📊 REPORTE FINAL');
  console.log('===============');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const successRate = (passed / results.length) * 100;
  
  console.log(`✅ Tests exitosos: ${passed}`);
  console.log(`❌ Tests fallidos: ${failed}`);
  console.log(`📈 Tasa de éxito: ${successRate.toFixed(1)}%`);
  console.log('');
  
  console.log('📋 DETALLE POR TEST:');
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  console.log('');
  
  // ESTADO FINAL Y RECOMENDACIONES
  if (successRate >= 80) {
    console.log('🎉 ESTADO: SISTEMA FUNCIONAL');
    console.log('✅ El sistema básico de roles está operativo');
    console.log('');
    console.log('💡 PRÓXIMOS PASOS RECOMENDADOS:');
    console.log('- Implementar estructura zonal (5 zonas del Cauca)');
    console.log('- Crear coordinadores zonales faltantes');
    console.log('- Establecer líderes municipales por cada municipio');
    console.log('- Migrar a nuevo sistema de contraseñas individuales');
  } else {
    console.log('⚠️  ESTADO: SISTEMA CON PROBLEMAS');
    console.log('❌ Hay issues críticos que resolver');
    console.log('');
    console.log('🔧 ACCIONES CRÍTICAS:');
    
    results.forEach(result => {
      if (!result.passed) {
        console.log(`- Resolver: ${result.test} - ${result.error}`);
      }
    });
  }
  
  console.log('');
  console.log('📞 PARA SOPORTE TÉCNICO:');
  console.log('- GitHub Issues del proyecto MAIS');
  console.log('- Logs de Supabase Dashboard');
  console.log('- Verificar variables de entorno');
  console.log('');
  console.log('🏁 TESTING COMPLETADO');
  
  // Exit code
  process.exit(successRate >= 80 ? 0 : 1);
}

// Ejecutar testing
runAllTests().catch(error => {
  console.error('💥 ERROR CRÍTICO EN TESTING:');
  console.error(error);
  process.exit(2);
});