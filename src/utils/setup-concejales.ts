// Utilidad para configuración inicial de concejales MAIS Cauca
import { supabase } from '../contexts/AppContext';
import { concejalesElectosCauca, CLAVE_ACCESO_INICIAL } from '../data/concejales-cauca';

export async function setupInitialAccess() {
  console.log('🔧 Configurando acceso inicial para concejales MAIS Cauca...');
  
  // Verificar conexión con Supabase
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('❌ Error conectando con Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión con Supabase establecida');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

export async function createConcejalProfile(concejalData: any, userId: string) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        name: concejalData.nombre,
        email: concejalData.email,
        role: 'concejal',
        region: concejalData.region,
        department: concejalData.departamento,
        municipality: concejalData.municipio,
        phone: concejalData.telefono,
        position: 'Concejal Municipal',
        election_date: concejalData.fechaEleccion,
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
      
    return !error;
  } catch (error) {
    console.error('Error creando perfil:', error);
    return false;
  }
}

// Función para usuarios que ya tienen cuenta creada manualmente
export async function updateExistingUserToCouncilor(email: string, concejalData: any) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: concejalData.nombre,
        role: 'concejal',
        region: concejalData.region,
        department: concejalData.departamento,
        municipality: concejalData.municipio,
        phone: concejalData.telefono,
        position: 'Concejal Municipal',
        election_date: concejalData.fechaEleccion,
        metadata: {
          tipo_usuario: 'concejal_electo',
          departamento: 'Cauca',
          periodo: '2024-2027',
          partido: 'MAIS',
          actualizado: true
        }
      })
      .eq('email', email);
      
    return !error;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return false;
  }
}

export function getConcejalDataByEmail(email: string) {
  return concejalesElectosCauca.find(c => 
    c.email.toLowerCase() === email.toLowerCase()
  );
}

export function listAllConcejales() {
  console.log('📋 CONCEJALES MAIS CAUCA - DATOS REALES');
  console.log('=====================================');
  concejalesElectosCauca.forEach((concejal, index) => {
    console.log(`${index + 1}. ${concejal.nombre}`);
    console.log(`   📧 ${concejal.email}`);
    console.log(`   🏛️ ${concejal.municipio}, ${concejal.departamento}`);
    console.log(`   📱 ${concejal.telefono}`);
    console.log('');
  });
  console.log(`🔑 Clave inicial para todos: ${CLAVE_ACCESO_INICIAL}`);
  console.log('=====================================');
}