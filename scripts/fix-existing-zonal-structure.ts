#!/usr/bin/env tsx
// REPARAR Y COMPLETAR ESTRUCTURA ZONAL EXISTENTE
// Los usuarios auth ya existen, falta completar perfiles

import { createClient } from '@supabase/supabase-js';

// Credenciales recuperadas
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

console.log('🔧 MAIS CAUCA - REPARACIÓN ESTRUCTURA ZONAL EXISTENTE');
console.log('==================================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Coordinadores zonales esperados
const COORDINADORES_ESPERADOS = [
  {
    email: 'carlos.vallejo@maiscauca.com',
    nombre: 'Carlos Eduardo Vallejo',
    zona: 'norte',
    cedula: '76123456',
    telefono: '3201234567'
  },
  {
    email: 'maria.gonzalez@maiscauca.com',
    nombre: 'María Patricia Gonzalez', 
    zona: 'sur',
    cedula: '76234567',
    telefono: '3202345678'
  },
  {
    email: 'roberto.munoz@maiscauca.com',
    nombre: 'Roberto Carlos Muñoz',
    zona: 'centro',
    cedula: '76345678',
    telefono: '3203456789'
  },
  {
    email: 'ana.torres@maiscauca.com',
    nombre: 'Ana Lucía Torres',
    zona: 'pacifico',
    cedula: '76456789',
    telefono: '3204567890'
  },
  {
    email: 'luis.chocue@maiscauca.com',
    nombre: 'Luis Fernando Chocué',
    zona: 'macizo',
    cedula: '76567890',
    telefono: '3205678901'
  }
];

interface RepairResult {
  email: string;
  authExists: boolean;
  profileExists: boolean;
  profileCreated: boolean;
  error?: string;
}

const results: RepairResult[] = [];

// Función para verificar y crear perfiles faltantes
async function repairCoordinatorProfile(coordinador: any) {
  console.log(`🔍 Verificando ${coordinador.nombre}...`);
  
  const result: RepairResult = {
    email: coordinador.email,
    authExists: false,
    profileExists: false,
    profileCreated: false
  };

  try {
    // Verificar si existe en Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      result.error = `Error verificando auth: ${authError.message}`;
      return result;
    }

    const authUser = authUsers?.users?.find(u => u.email === coordinador.email);
    
    if (!authUser) {
      result.error = 'Usuario no existe en Auth';
      return result;
    }

    result.authExists = true;
    console.log(`   ✅ Auth existe: ${authUser.id}`);

    // Verificar si existe perfil
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('id, full_name, role, status')
      .eq('id', authUser.id)
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      result.error = `Error verificando perfil: ${profileCheckError.message}`;
      return result;
    }

    if (existingProfile) {
      result.profileExists = true;
      console.log(`   ✅ Perfil ya existe: ${existingProfile.role}`);
      return result;
    }

    // Crear perfil faltante
    console.log(`   🔨 Creando perfil para ${coordinador.nombre}...`);
    
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.id,
        email: coordinador.email,
        full_name: coordinador.nombre,
        role: 'coordinador-zonal',
        status: 'active',
        phone: coordinador.telefono,
        document_number: coordinador.cedula,
        metadata: {
          zona: coordinador.zona,
          needsPasswordChange: true,
          role_level: 2,
          can_create_roles: ['lider-municipal', 'lider-comunitario', 'votante'],
          created_via: 'repair_script'
        }
      });

    if (insertError) {
      result.error = `Error creando perfil: ${insertError.message}`;
      console.log(`   ❌ Error: ${insertError.message}`);
      return result;
    }

    result.profileCreated = true;
    console.log(`   ✅ Perfil creado exitosamente`);
    
    return result;

  } catch (error) {
    result.error = `Excepción: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    console.log(`   💥 Excepción: ${result.error}`);
    return result;
  } finally {
    results.push(result);
  }
}

// Función para verificar estado de la estructura
async function verifyZonalStructure() {
  console.log('📊 VERIFICANDO ESTADO ACTUAL DE LA ESTRUCTURA...');
  console.log('');

  try {
    // Contar coordinadores zonales
    const { data: coordinadores, error: coordError } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role, status')
      .eq('role', 'coordinador-zonal')
      .eq('status', 'active');

    if (coordError) {
      console.log('❌ Error verificando coordinadores:', coordError.message);
      return;
    }

    console.log(`👥 Coordinadores zonales encontrados: ${coordinadores?.length || 0}`);
    coordinadores?.forEach(coord => {
      console.log(`   - ${coord.full_name} (${coord.email})`);
    });

    // Contar líderes municipales
    const { data: lideres, error: lideresError } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role, status')
      .eq('role', 'lider-municipal')
      .eq('status', 'active');

    if (!lideresError) {
      console.log(`🏘️  Líderes municipales encontrados: ${lideres?.length || 0}`);
    }

    console.log('');

  } catch (error) {
    console.log('❌ Error en verificación:', error);
  }
}

// Ejecutar reparación completa
async function runRepair() {
  try {
    console.log('🚀 INICIANDO REPARACIÓN DE ESTRUCTURA ZONAL...');
    console.log('');

    // Verificar estado inicial
    await verifyZonalStructure();

    // Reparar cada coordinador
    for (const coordinador of COORDINADORES_ESPERADOS) {
      await repairCoordinatorProfile(coordinador);
      console.log('');
    }

    // Generar reporte final
    console.log('📊 REPORTE FINAL DE REPARACIÓN');
    console.log('=============================');

    let authExistente = 0;
    let perfilesExistentes = 0;
    let perfilesCreados = 0;
    let errores = 0;

    results.forEach(result => {
      if (result.authExists) authExistente++;
      if (result.profileExists) perfilesExistentes++;
      if (result.profileCreated) perfilesCreados++;
      if (result.error) errores++;

      const statusIcon = result.profileExists || result.profileCreated ? '✅' : '❌';
      console.log(`${statusIcon} ${result.email}:`);
      console.log(`   Auth: ${result.authExists ? 'Existe' : 'Faltante'}`);
      console.log(`   Perfil: ${result.profileExists ? 'Existía' : result.profileCreated ? 'Creado' : 'Falló'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log('');
    console.log('📈 ESTADÍSTICAS:');
    console.log(`👤 Usuarios Auth existentes: ${authExistente}/5`);
    console.log(`👤 Perfiles existentes: ${perfilesExistentes}/5`);
    console.log(`🔨 Perfiles creados: ${perfilesCreados}/5`);
    console.log(`❌ Errores: ${errores}/5`);

    // Verificar estado final
    console.log('');
    console.log('🔍 VERIFICANDO ESTADO FINAL...');
    console.log('');
    await verifyZonalStructure();

    const totalFuncional = perfilesExistentes + perfilesCreados;
    if (totalFuncional >= 4) {
      console.log('🎉 REPARACIÓN EXITOSA');
      console.log('✅ Estructura zonal funcional');
      console.log('✅ Coordinadores zonales operativos');
    } else {
      console.log('⚠️  REPARACIÓN PARCIAL');
      console.log('❌ Algunos coordinadores no pudieron configurarse');
    }

    console.log('');
    console.log('💡 PRÓXIMOS PASOS:');
    console.log('- Probar login de coordinadores zonales');
    console.log('- Crear líderes municipales por zona');
    console.log('- Verificar permisos de creación de roles');

    console.log('');
    console.log('🏁 REPARACIÓN COMPLETADA');
    
    process.exit(totalFuncional >= 4 ? 0 : 1);

  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN REPARACIÓN:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar reparación
runRepair();