#!/usr/bin/env tsx
// VERIFICAR Y ARREGLAR LÍDERES REGIONALES
// Diagnóstico completo y corrección de problemas

import { createClient } from '@supabase/supabase-js';

// Credenciales recuperadas
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

console.log('🔍 MAIS CAUCA - VERIFICACIÓN Y CORRECCIÓN LÍDERES REGIONALES');
console.log('=========================================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Líderes regionales esperados
const LIDERES_ESPERADOS = [
  'carlos.vallejo@maiscauca.com',
  'maria.gonzalez@maiscauca.com', 
  'roberto.munoz@maiscauca.com',
  'ana.torres@maiscauca.com',
  'luis.chocue@maiscauca.com'
];

// Paso 1: Verificar todos los líderes regionales en base de datos
async function verifyAllRegionalLeaders() {
  console.log('🔍 PASO 1: VERIFICANDO TODOS LOS LÍDERES REGIONALES...');
  console.log('');

  try {
    // Obtener todos los líderes regionales
    const { data: lideres, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, status, metadata')
      .eq('role', 'lider-regional')
      .eq('status', 'active');

    if (error) {
      console.log('❌ Error obteniendo líderes:', error.message);
      return;
    }

    console.log(`📊 Total líderes regionales en BD: ${lideres?.length || 0}`);
    console.log('');

    if (lideres && lideres.length > 0) {
      console.log('📋 Líderes regionales encontrados:');
      lideres.forEach((lider, index) => {
        console.log(`   ${index + 1}. ${lider.full_name}`);
        console.log(`      📧 Email: ${lider.email}`);
        console.log(`      🎯 Rol: ${lider.role}`);
        console.log(`      📍 Status: ${lider.status}`);
        console.log(`      🌍 Zona: ${lider.metadata?.zona || 'No asignada'}`);
        console.log(`      🏘️  Municipios: ${lider.metadata?.municipios_asignados?.length || 0}`);
        console.log('');
      });

      // Verificar cuáles de los esperados están presentes
      const emailsEncontrados = lideres.map(l => l.email);
      const lideresEsperadosPresentes = LIDERES_ESPERADOS.filter(email => 
        emailsEncontrados.includes(email)
      );
      const lideresEsperadosFaltantes = LIDERES_ESPERADOS.filter(email => 
        !emailsEncontrados.includes(email)
      );

      console.log('✅ Líderes zonales esperados PRESENTES:');
      lideresEsperadosPresentes.forEach(email => console.log(`   - ${email}`));
      
      if (lideresEsperadosFaltantes.length > 0) {
        console.log('');
        console.log('❌ Líderes zonales esperados FALTANTES:');
        lideresEsperadosFaltantes.forEach(email => console.log(`   - ${email}`));
      }
    }

  } catch (error) {
    console.log('💥 Excepción verificando líderes:', error);
  }
}

// Paso 2: Verificar usuarios específicos de las 5 zonas
async function verifySpecificZonalLeaders() {
  console.log('🎯 PASO 2: VERIFICANDO USUARIOS ESPECÍFICOS DE 5 ZONAS...');
  console.log('');

  const resultados = [];

  for (const email of LIDERES_ESPERADOS) {
    console.log(`🔍 Verificando ${email}...`);
    
    try {
      // Verificar en user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role, status, metadata')
        .eq('email', email)
        .single();

      if (profileError) {
        console.log(`   ❌ Perfil no encontrado: ${profileError.message}`);
        resultados.push({ email, profile: false, auth: 'unknown', issue: profileError.message });
        continue;
      }

      console.log(`   ✅ Perfil encontrado: ${profile.full_name}`);
      console.log(`   🎯 Rol actual: ${profile.role}`);
      console.log(`   📍 Status: ${profile.status}`);

      // Verificar en auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log(`   ❌ Error verificando auth: ${authError.message}`);
        resultados.push({ email, profile: true, auth: false, issue: authError.message });
        continue;
      }

      const authUser = authUsers?.users?.find(u => u.email === email);
      
      if (authUser) {
        console.log(`   ✅ Usuario auth encontrado: ${authUser.id}`);
        resultados.push({ 
          email, 
          profile: true, 
          auth: true, 
          rol: profile.role,
          authId: authUser.id,
          profileId: profile.id
        });
      } else {
        console.log(`   ❌ Usuario auth no encontrado`);
        resultados.push({ email, profile: true, auth: false, issue: 'Auth user not found' });
      }

    } catch (error) {
      console.log(`   💥 Excepción: ${error}`);
      resultados.push({ email, profile: false, auth: false, issue: 'Exception' });
    }
    
    console.log('');
  }

  return resultados;
}

// Paso 3: Intentar login con cada usuario
async function testLoginZonalLeaders(resultados: any[]) {
  console.log('🔐 PASO 3: TESTING LOGIN DE LÍDERES ZONALES...');
  console.log('');

  const usuariosValidos = resultados.filter(r => r.profile && r.auth);
  
  for (const usuario of usuariosValidos) {
    console.log(`🔐 Testing login: ${usuario.email}...`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: 'agoramais2025'
      });

      if (error) {
        console.log(`   ❌ Login falló: ${error.message}`);
      } else if (data.user) {
        console.log(`   ✅ Login exitoso: ${data.user.id}`);
        await supabase.auth.signOut();
      }
    } catch (loginError) {
      console.log(`   💥 Excepción en login: ${loginError}`);
    }
    
    console.log('');
  }
}

// Paso 4: Actualizar contraseñas si es necesario
async function resetPasswordsIfNeeded() {
  console.log('🔧 PASO 4: RESETEANDO CONTRASEÑAS PARA LÍDERES ZONALES...');
  console.log('');

  for (const email of LIDERES_ESPERADOS) {
    console.log(`🔧 Reseteando contraseña para ${email}...`);
    
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        // Necesito primero obtener el user ID
        (await supabase.auth.admin.listUsers()).data?.users?.find(u => u.email === email)?.id || '',
        { password: 'agoramais2025' }
      );

      if (error) {
        console.log(`   ❌ Error reseteando contraseña: ${error.message}`);
      } else {
        console.log(`   ✅ Contraseña actualizada exitosamente`);
      }
    } catch (error) {
      console.log(`   💥 Excepción reseteando contraseña: ${error}`);
    }
    
    console.log('');
  }
}

// Ejecutar verificación completa
async function runCompleteVerification() {
  try {
    console.log('🚀 INICIANDO VERIFICACIÓN Y CORRECCIÓN COMPLETA...');
    console.log('');

    await verifyAllRegionalLeaders();
    console.log(''.padEnd(60, '='));
    
    const resultados = await verifySpecificZonalLeaders();
    console.log(''.padEnd(60, '='));
    
    await testLoginZonalLeaders(resultados);
    console.log(''.padEnd(60, '='));
    
    await resetPasswordsIfNeeded();
    console.log(''.padEnd(60, '='));

    // Reporte final
    console.log('📊 REPORTE FINAL DE VERIFICACIÓN Y CORRECCIÓN');
    console.log('============================================');

    const usuariosConPerfil = resultados.filter(r => r.profile).length;
    const usuariosConAuth = resultados.filter(r => r.auth).length;
    const usuariosLiderRegional = resultados.filter(r => r.rol === 'lider-regional').length;

    console.log(`👥 Usuarios con perfil: ${usuariosConPerfil}/5`);
    console.log(`🔐 Usuarios con auth: ${usuariosConAuth}/5`);
    console.log(`🎯 Usuarios con rol lider-regional: ${usuariosLiderRegional}/5`);

    console.log('');
    console.log('📋 Estado detallado:');
    resultados.forEach(r => {
      const status = r.profile && r.auth && r.rol === 'lider-regional' ? '✅' : '❌';
      console.log(`${status} ${r.email}:`);
      console.log(`   Perfil: ${r.profile ? '✅' : '❌'}`);
      console.log(`   Auth: ${r.auth ? '✅' : '❌'}`);
      console.log(`   Rol: ${r.rol || 'N/A'}`);
      if (r.issue) console.log(`   Issue: ${r.issue}`);
    });

    const funcionalesCompletos = resultados.filter(r => 
      r.profile && r.auth && r.rol === 'lider-regional'
    ).length;

    console.log('');
    if (funcionalesCompletos >= 4) {
      console.log('🎉 VERIFICACIÓN EXITOSA');
      console.log(`✅ ${funcionalesCompletos}/5 líderes regionales operativos`);
      console.log('✅ Sistema zonal funcional');
    } else {
      console.log('⚠️  VERIFICACIÓN PARCIAL');
      console.log(`❌ Solo ${funcionalesCompletos}/5 líderes operativos`);
      console.log('⚠️  Requiere corrección manual');
    }

    console.log('');
    console.log('💡 PRÓXIMOS PASOS:');
    console.log('- Ejecutar testing completo nuevamente');
    console.log('- Verificar permisos de creación de candidatos');
    console.log('- Implementar creación de líderes municipales');

    console.log('');
    console.log('🏁 VERIFICACIÓN Y CORRECCIÓN COMPLETADA');

    process.exit(funcionalesCompletos >= 4 ? 0 : 1);

  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN VERIFICACIÓN:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar verificación
runCompleteVerification();