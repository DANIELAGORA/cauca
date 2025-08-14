#!/usr/bin/env tsx
// IMPLEMENTACIÓN DE ESTRUCTURA DE 5 ZONAS DEL CAUCA
// Sistema completo de coordinadores zonales y líderes municipales

import { createClient } from '@supabase/supabase-js';

// Credenciales recuperadas
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

console.log('🗺️  MAIS CAUCA - IMPLEMENTACIÓN ESTRUCTURA 5 ZONAS');
console.log('===============================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Definición de la estructura de 5 zonas del Cauca
const ESTRUCTURA_CAUCA = {
  NORTE: {
    nombre: 'Zona Norte del Cauca',
    coordinador: {
      nombre: 'Carlos Eduardo Vallejo',
      email: 'carlos.vallejo@maiscauca.com',
      cedula: '76123456',
      telefono: '3201234567'
    },
    municipios: [
      'Santander de Quilichao',
      'Villa Rica', 
      'Caldono',
      'Morales',
      'Suárez'
    ]
  },
  SUR: {
    nombre: 'Zona Sur del Cauca',
    coordinador: {
      nombre: 'María Patricia Gonzalez',
      email: 'maria.gonzalez@maiscauca.com',
      cedula: '76234567',
      telefono: '3202345678'
    },
    municipios: [
      'Florencia',
      'Bolívar',
      'Mercaderes',
      'Patía (El Bordo)',
      'Balboa'
    ]
  },
  CENTRO: {
    nombre: 'Zona Centro del Cauca',
    coordinador: {
      nombre: 'Roberto Carlos Muñoz',
      email: 'roberto.munoz@maiscauca.com',
      cedula: '76345678',
      telefono: '3203456789'
    },
    municipios: [
      'Popayán',
      'Timbío',
      'Sotará (Paispamba)',
      'Puracé (Coconuco)',
      'Silvia'
    ]
  },
  PACIFICO: {
    nombre: 'Zona Pacífico del Cauca',
    coordinador: {
      nombre: 'Ana Lucía Torres',
      email: 'ana.torres@maiscauca.com',
      cedula: '76456789',
      telefono: '3204567890'
    },
    municipios: [
      'Guapi',
      'Timbiquí',
      'López de Micay',
      'Argelia'
    ]
  },
  MACIZO: {
    nombre: 'Zona Macizo Colombiano',
    coordinador: {
      nombre: 'Luis Fernando Chocué',
      email: 'luis.chocue@maiscauca.com',
      cedula: '76567890',
      telefono: '3205678901'
    },
    municipios: [
      'Almaguer',
      'San Sebastián',
      'Santa Rosa',
      'La Sierra',
      'La Vega',
      'Rosas'
    ]
  }
};

// Función para generar contraseña temporal
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = 'Mais';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password + '2025!';
}

interface ImplementationResult {
  zona: string;
  coordinadorCreado: boolean;
  municipiosConfigured: number;
  lideresCreated: number;
  error?: string;
}

const results: ImplementationResult[] = [];

// Paso 1: Crear coordinadores zonales
async function createZonalCoordinator(zona: string, config: any) {
  console.log(`🎯 Creando coordinador para ${config.nombre}...`);
  
  try {
    const tempPassword = generateTemporaryPassword();
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: config.coordinador.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: config.coordinador.nombre,
        role: 'coordinador-zonal',
        zona: zona.toLowerCase(),
        telefono: config.coordinador.telefono,
        cedula: config.coordinador.cedula
      }
    });

    if (authError) {
      console.log(`❌ Error creando auth para ${config.coordinador.nombre}: ${authError.message}`);
      return false;
    }

    // Crear perfil en user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: config.coordinador.email,
        full_name: config.coordinador.nombre,
        role: 'coordinador-zonal',
        status: 'active',
        phone: config.coordinador.telefono,
        document_number: config.coordinador.cedula,
        metadata: {
          temporalPassword: tempPassword,
          needsPasswordChange: true,
          role_level: 2,
          can_create_roles: ['lider-municipal', 'lider-comunitario', 'votante']
        }
      });

    if (profileError) {
      console.log(`❌ Error creando perfil para ${config.coordinador.nombre}: ${profileError.message}`);
      return false;
    }

    console.log(`✅ Coordinador creado: ${config.coordinador.nombre}`);
    console.log(`   📧 Email: ${config.coordinador.email}`);
    console.log(`   🔑 Contraseña temporal: ${tempPassword}`);
    
    return true;

  } catch (error) {
    console.log(`💥 Excepción creando coordinador para ${zona}:`, error);
    return false;
  }
}

// Paso 2: Crear líderes municipales para cada municipio
async function createMunicipalLeaders(zona: string, config: any, coordinadorId: string) {
  console.log(`🏘️  Creando líderes municipales para ${config.nombre}...`);
  
  let leadersCreated = 0;
  
  for (const municipio of config.municipios) {
    try {
      const tempPassword = generateTemporaryPassword();
      const leaderEmail = `lider.${municipio.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')}@maiscauca.com`;
      const leaderName = `Líder Municipal de ${municipio}`;
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: leaderEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: leaderName,
          role: 'lider-municipal',
          zona: zona.toLowerCase(),
          municipio: municipio
        }
      });

      if (authError) {
        console.log(`❌ Error creando auth para líder de ${municipio}: ${authError.message}`);
        continue;
      }

      // Crear perfil en user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: leaderEmail,
          full_name: leaderName,
          role: 'lider-municipal',
          status: 'active',
          metadata: {
            temporalPassword: tempPassword,
            needsPasswordChange: true,
            role_level: 3,
            can_create_roles: ['lider-comunitario', 'votante']
          }
        });

      if (profileError) {
        console.log(`❌ Error creando perfil para líder de ${municipio}: ${profileError.message}`);
        continue;
      }

      console.log(`   ✅ Líder creado: ${municipio}`);
      leadersCreated++;

    } catch (error) {
      console.log(`   ❌ Excepción creando líder para ${municipio}:`, error);
    }
  }
  
  return leadersCreated;
}

// Implementar estructura completa
async function implementZonalStructure() {
  try {
    console.log('🚀 INICIANDO IMPLEMENTACIÓN DE ESTRUCTURA ZONAL...');
    console.log('');

    // Verificar director departamental existe
    console.log('👑 Verificando director departamental...');
    const { data: director, error: directorError } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role')
      .eq('email', 'joseluisdiago@maiscauca.com')
      .single();

    if (directorError || !director) {
      console.log('❌ CRÍTICO: Director departamental no encontrado');
      console.log('   Se requiere José Luis Diago Franco para continuar');
      process.exit(1);
    }

    console.log(`✅ Director encontrado: ${director.full_name}`);
    console.log('');

    // Implementar cada zona
    for (const [zonaKey, zonaConfig] of Object.entries(ESTRUCTURA_CAUCA)) {
      console.log(`🌍 Implementando ${zonaConfig.nombre}...`);
      console.log('='.repeat(50));
      
      const result: ImplementationResult = {
        zona: zonaKey,
        coordinadorCreado: false,
        municipiosConfigured: zonaConfig.municipios.length,
        lideresCreated: 0
      };

      // Crear coordinador zonal
      const coordinadorCreated = await createZonalCoordinator(zonaKey, zonaConfig);
      result.coordinadorCreado = coordinadorCreated;

      if (coordinadorCreated) {
        // Obtener ID del coordinador recién creado
        const { data: coordinadorData } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', zonaConfig.coordinador.email)
          .single();

        if (coordinadorData) {
          // Crear líderes municipales
          const leadersCreated = await createMunicipalLeaders(
            zonaKey, 
            zonaConfig, 
            coordinadorData.id
          );
          result.lideresCreated = leadersCreated;
        }
      }

      results.push(result);
      console.log('');
    }

    // Generar reporte final
    console.log('📊 REPORTE FINAL DE IMPLEMENTACIÓN');
    console.log('==================================');

    let totalCoordinadores = 0;
    let totalLideres = 0;

    results.forEach(result => {
      const icon = result.coordinadorCreado ? '✅' : '❌';
      console.log(`${icon} ${result.zona}:`);
      console.log(`   Coordinador: ${result.coordinadorCreado ? 'CREADO' : 'FALLÓ'}`);
      console.log(`   Líderes municipales: ${result.lideresCreated}/${result.municipiosConfigured}`);
      
      if (result.coordinadorCreado) totalCoordinadores++;
      totalLideres += result.lideresCreated;
    });

    console.log('');
    console.log('📈 ESTADÍSTICAS GLOBALES:');
    console.log(`👥 Coordinadores zonales creados: ${totalCoordinadores}/5`);
    console.log(`🏘️  Líderes municipales creados: ${totalLideres}/42`);
    console.log(`📊 Tasa de éxito: ${((totalCoordinadores + totalLideres) / 47 * 100).toFixed(1)}%`);

    console.log('');
    console.log('🎯 ESTRUCTURA TERRITORIAL COMPLETA:');
    console.log('1. Director Departamental (José Luis Diago)');
    console.log(`2. ${totalCoordinadores} Coordinadores Zonales`);
    console.log(`3. ${totalLideres} Líderes Municipales`);
    console.log('4. Capacidad para crear líderes comunitarios');
    console.log('5. Capacidad para registrar votantes');

    console.log('');
    if (totalCoordinadores >= 4 && totalLideres >= 30) {
      console.log('🎉 IMPLEMENTACIÓN EXITOSA');
      console.log('✅ Estructura zonal operativa');
      console.log('✅ Jerarquía de roles establecida');
      console.log('✅ Permisos de creación configurados');
    } else {
      console.log('⚠️  IMPLEMENTACIÓN PARCIAL');
      console.log('❌ Algunos elementos no se crearon correctamente');
    }

    console.log('');
    console.log('💡 PRÓXIMOS PASOS:');
    console.log('- Verificar login de coordinadores zonales');
    console.log('- Probar creación de líderes comunitarios');
    console.log('- Establecer votantes por cada territorio');
    console.log('- Implementar dashboard específico por zona');

    console.log('');
    console.log('🔐 CREDENCIALES GENERADAS:');
    console.log('Ver logs anteriores para contraseñas temporales');
    console.log('Todos los usuarios deben cambiar contraseña al primer login');

    console.log('');
    console.log('🏁 IMPLEMENTACIÓN ZONAL COMPLETADA');

    process.exit(0);

  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN IMPLEMENTACIÓN:');
    console.error(error);
    
    console.log('');
    console.log('🚨 IMPLEMENTACIÓN FALLIDA');
    console.log('❌ La estructura zonal no pudo establecerse');
    
    process.exit(1);
  }
}

// Ejecutar implementación
implementZonalStructure();