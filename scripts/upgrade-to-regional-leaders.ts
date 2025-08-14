#!/usr/bin/env tsx
// ACTUALIZAR COORDINADORES ZONALES A LÍDERES REGIONALES
// Usar roles existentes en el sistema

import { createClient } from '@supabase/supabase-js';

// Credenciales recuperadas
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

console.log('⬆️  MAIS CAUCA - ACTUALIZACIÓN A LÍDERES REGIONALES');
console.log('===============================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Coordinadores zonales a actualizar
const COORDINADORES_ZONALES = [
  {
    email: 'carlos.vallejo@maiscauca.com',
    nombre: 'Carlos Eduardo Vallejo',
    zona: 'Norte del Cauca',
    municipios: ['Santander de Quilichao', 'Villa Rica', 'Caldono', 'Morales', 'Suárez']
  },
  {
    email: 'maria.gonzalez@maiscauca.com',
    nombre: 'María Patricia Gonzalez',
    zona: 'Sur del Cauca',
    municipios: ['Florencia', 'Bolívar', 'Mercaderes', 'Patía (El Bordo)', 'Balboa']
  },
  {
    email: 'roberto.munoz@maiscauca.com',
    nombre: 'Roberto Carlos Muñoz',
    zona: 'Centro del Cauca',
    municipios: ['Popayán', 'Timbío', 'Sotará (Paispamba)', 'Puracé (Coconuco)', 'Silvia']
  },
  {
    email: 'ana.torres@maiscauca.com',
    nombre: 'Ana Lucía Torres',
    zona: 'Pacífico del Cauca',
    municipios: ['Guapi', 'Timbiquí', 'López de Micay', 'Argelia']
  },
  {
    email: 'luis.chocue@maiscauca.com',
    nombre: 'Luis Fernando Chocué',
    zona: 'Macizo Colombiano',
    municipios: ['Almaguer', 'San Sebastián', 'Santa Rosa', 'La Sierra', 'La Vega', 'Rosas']
  }
];

interface UpgradeResult {
  email: string;
  nombre: string;
  zona: string;
  upgraded: boolean;
  error?: string;
}

const results: UpgradeResult[] = [];

// Función para actualizar coordinador a líder regional
async function upgradeToRegionalLeader(coordinador: any) {
  console.log(`🎯 Actualizando ${coordinador.nombre} (${coordinador.zona})...`);
  
  const result: UpgradeResult = {
    email: coordinador.email,
    nombre: coordinador.nombre,
    zona: coordinador.zona,
    upgraded: false
  };

  try {
    // Actualizar rol a lider-regional
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role: 'lider-regional',
        bio: `Líder Regional de la ${coordinador.zona}`,
        metadata: {
          zona: coordinador.zona,
          municipios_asignados: coordinador.municipios,
          role_level: 2,
          can_create_roles: ['candidato', 'lider-comunitario', 'votante'],
          territorial_scope: coordinador.zona,
          upgraded_on: new Date().toISOString(),
          total_municipios: coordinador.municipios.length
        }
      })
      .eq('email', coordinador.email)
      .select();

    if (updateError) {
      result.error = updateError.message;
      console.log(`❌ Error: ${updateError.message}`);
      return result;
    }

    if (!updateData || updateData.length === 0) {
      result.error = 'Usuario no encontrado';
      console.log(`❌ Usuario no encontrado: ${coordinador.email}`);
      return result;
    }

    result.upgraded = true;
    console.log(`✅ Actualizado exitosamente`);
    console.log(`   📧 Email: ${coordinador.email}`);
    console.log(`   🎯 Rol: lider-regional`);
    console.log(`   🌍 Zona: ${coordinador.zona}`);
    console.log(`   🏘️  Municipios: ${coordinador.municipios.length}`);

    return result;

  } catch (error) {
    result.error = `Excepción: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    console.log(`💥 Excepción: ${result.error}`);
    return result;
  } finally {
    results.push(result);
  }
}

// Verificar roles disponibles en el sistema
async function checkAvailableRoles() {
  console.log('🔍 VERIFICANDO ROLES DISPONIBLES EN EL SISTEMA...');
  console.log('');

  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('role, COUNT(*)')
      .not('role', 'is', null);

    if (error) {
      console.log('❌ Error verificando roles:', error.message);
      return;
    }

    // Obtener roles únicos
    const { data: roleData, error: roleError } = await supabase
      .from('user_profiles')
      .select('role')
      .not('role', 'is', null);

    if (!roleError && roleData) {
      const uniqueRoles = [...new Set(roleData.map(u => u.role))];
      console.log('📋 Roles disponibles en el sistema:');
      uniqueRoles.forEach(role => {
        const count = roleData.filter(u => u.role === role).length;
        console.log(`   - ${role} (${count} usuarios)`);
      });
    }

    console.log('');
  } catch (error) {
    console.log('❌ Error verificando roles:', error);
  }
}

// Verificar estructura final
async function verifyFinalStructure() {
  console.log('🏗️  VERIFICANDO ESTRUCTURA FINAL...');
  console.log('');

  try {
    // Contar por rol
    const roles = ['comite-departamental', 'lider-regional', 'candidato', 'votante'];
    
    for (const role of roles) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .eq('role', role)
        .eq('status', 'active');

      if (!error && data) {
        console.log(`👥 ${role.toUpperCase()}: ${data.length} usuarios`);
        data.forEach(user => {
          console.log(`   - ${user.full_name} (${user.email})`);
        });
        console.log('');
      }
    }

  } catch (error) {
    console.log('❌ Error verificando estructura:', error);
  }
}

// Ejecutar actualización completa
async function runUpgrade() {
  try {
    console.log('🚀 INICIANDO ACTUALIZACIÓN A LÍDERES REGIONALES...');
    console.log('');

    // Verificar roles disponibles
    await checkAvailableRoles();

    // Actualizar cada coordinador
    for (const coordinador of COORDINADORES_ZONALES) {
      await upgradeToRegionalLeader(coordinador);
      console.log('');
    }

    // Generar reporte final
    console.log('📊 REPORTE FINAL DE ACTUALIZACIÓN');
    console.log('=================================');

    let exitosos = 0;
    let fallidos = 0;

    results.forEach(result => {
      const icon = result.upgraded ? '✅' : '❌';
      console.log(`${icon} ${result.nombre}:`);
      console.log(`   📧 Email: ${result.email}`);
      console.log(`   🌍 Zona: ${result.zona}`);
      console.log(`   Status: ${result.upgraded ? 'ACTUALIZADO' : 'FALLÓ'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }

      if (result.upgraded) exitosos++;
      else fallidos++;
    });

    console.log('');
    console.log('📈 ESTADÍSTICAS:');
    console.log(`✅ Actualizaciones exitosas: ${exitosos}/5`);
    console.log(`❌ Actualizaciones fallidas: ${fallidos}/5`);
    console.log(`📊 Tasa de éxito: ${(exitosos/5*100).toFixed(1)}%`);

    // Verificar estructura final
    console.log('');
    await verifyFinalStructure();

    if (exitosos >= 4) {
      console.log('🎉 ACTUALIZACIÓN EXITOSA');
      console.log('✅ Líderes regionales configurados');
      console.log('✅ Estructura zonal establecida');
      console.log('✅ Jerarquía territorial operativa');
    } else {
      console.log('⚠️  ACTUALIZACIÓN PARCIAL');
      console.log('❌ Algunos líderes no se pudieron actualizar');
    }

    console.log('');
    console.log('💡 PRÓXIMOS PASOS:');
    console.log('- Probar login de líderes regionales');
    console.log('- Verificar permisos de creación de candidatos');
    console.log('- Crear líderes comunitarios por municipio');
    console.log('- Establecer votantes en cada territorio');

    console.log('');
    console.log('🔐 CREDENCIALES:');
    console.log('Todos los líderes regionales usan: agoramais2025');
    console.log('(Deben cambiar contraseña al primer login)');

    console.log('');
    console.log('🏁 ACTUALIZACIÓN COMPLETADA');
    
    process.exit(exitosos >= 4 ? 0 : 1);

  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN ACTUALIZACIÓN:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar actualización
runUpgrade();