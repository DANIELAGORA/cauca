// Script de inicialización de usuarios reales - MAIS Cauca
// Ejecutar una sola vez para crear los concejales en producción

import { createClient } from '@supabase/supabase-js';
import { concejalesElectosCauca, CLAVE_ACCESO_INICIAL, departamentalInfo } from '../data/concejales-cauca';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesita service role key

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function crearConcejalReal(concejal: any) {
  try {
    console.log(`🔄 Creando usuario para ${concejal.nombre}...`);
    
    // 1. Crear usuario en Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: concejal.email,
      password: CLAVE_ACCESO_INICIAL,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: concejal.nombre,
        municipio: concejal.municipio,
        departamento: concejal.departamento,
        telefono: concejal.telefono,
        role: 'concejal',
        tipo_cargo: 'Concejal Municipal',
        fecha_eleccion: concejal.fechaEleccion
      }
    });

    if (authError) {
      console.error(`❌ Error creando auth para ${concejal.nombre}:`, authError);
      return false;
    }

    // 2. Crear perfil en user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        name: concejal.nombre,
        email: concejal.email,
        role: 'concejal',
        region: concejal.region,
        department: concejal.departamento,
        municipality: concejal.municipio,
        phone: concejal.telefono,
        position: 'Concejal Municipal',
        election_date: concejal.fechaEleccion,
        is_active: true,
        created_at: new Date().toISOString(),
        metadata: {
          tipo_usuario: 'concejal_electo',
          departamento: 'Cauca',
          periodo: '2024-2027',
          partido: 'MAIS',
          acceso_inicial: true
        }
      });

    if (profileError) {
      console.error(`❌ Error creando perfil para ${concejal.nombre}:`, profileError);
      // Eliminar usuario de auth si falla el perfil
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return false;
    }

    console.log(`✅ Usuario creado exitosamente: ${concejal.nombre} (${concejal.municipio})`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error general creando ${concejal.nombre}:`, error);
    return false;
  }
}

async function crearCoordinadorDepartamental() {
  try {
    console.log('🔄 Creando Coordinador Departamental...');
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: departamentalInfo.coordinadorDepartamental.email,
      password: CLAVE_ACCESO_INICIAL,
      email_confirm: true,
      user_metadata: {
        name: departamentalInfo.coordinadorDepartamental.nombre,
        departamento: 'Cauca',
        role: 'comite-departamental',
        tipo_cargo: 'Coordinador Departamental'
      }
    });

    if (authError) {
      console.error('❌ Error creando coordinador departamental:', authError);
      return false;
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        name: departamentalInfo.coordinadorDepartamental.nombre,
        email: departamentalInfo.coordinadorDepartamental.email,
        role: 'comite-departamental',
        region: 'Andina',
        department: 'Cauca',
        position: 'Coordinador Departamental',
        is_active: true,
        created_at: new Date().toISOString(),
        metadata: {
          tipo_usuario: 'coordinador_departamental',
          departamento: 'Cauca',
          partido: 'MAIS',
          acceso_completo: true
        }
      });

    if (profileError) {
      console.error('❌ Error creando perfil coordinador:', profileError);
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return false;
    }

    console.log('✅ Coordinador Departamental creado exitosamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error general creando coordinador:', error);
    return false;
  }
}

async function inicializarSistemaMaisCauca() {
  console.log('🚀 INICIALIZANDO SISTEMA MAIS CAUCA - PRODUCCIÓN');
  console.log('================================================');
  console.log(`📊 Total concejales a crear: ${concejalesElectosCauca.length}`);
  console.log(`🏛️ Municipios con presencia MAIS: ${departamentalInfo.municipiosConPresencia}`);
  console.log(`🔑 Clave inicial: ${CLAVE_ACCESO_INICIAL}`);
  console.log('================================================');

  let exitosos = 0;
  let errores = 0;

  // Crear coordinador departamental
  const coordinadorCreado = await crearCoordinadorDepartamental();
  if (coordinadorCreado) exitosos++;
  else errores++;

  // Crear cada concejal
  for (const concejal of concejalesElectosCauca) {
    const creado = await crearConcejalReal(concejal);
    if (creado) exitosos++;
    else errores++;
    
    // Pausa para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('================================================');
  console.log('📈 RESUMEN DE INICIALIZACIÓN');
  console.log(`✅ Usuarios creados exitosamente: ${exitosos}`);
  console.log(`❌ Errores: ${errores}`);
  console.log('================================================');
  
  if (errores === 0) {
    console.log('🎉 SISTEMA MAIS CAUCA INICIALIZADO CORRECTAMENTE');
    console.log('🔐 Los usuarios pueden acceder con:');
    console.log(`   - Email: Su email registrado`);
    console.log(`   - Contraseña: ${CLAVE_ACCESO_INICIAL}`);
    console.log('💡 Pueden cambiar su contraseña desde el panel de control');
  } else {
    console.log('⚠️  Algunos usuarios no se pudieron crear. Revisar errores.');
  }
}

// Ejecutar inicialización si se ejecuta directamente
if (require.main === module) {
  inicializarSistemaMaisCauca()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { inicializarSistemaMaisCauca };