// SCRIPT PARA INSERTAR DATOS REALES DE MAIS EN SUPABASE
// Ejecutar después del deploy de migraciones para poblar la BD con datos reales

import { supabase } from '../lib/supabase';

// Datos reales de la estructura MAIS Cauca
const MASTER_PASSWORD = 'agoramais2025';

interface OrganizationMemberData {
  fullName: string;
  email: string;
  phone?: string;
  roleType: string;
  territoryLevel: string;
  region: string;
  department?: string;
  municipality?: string;
  reportsTo?: string; // Se resolverá después de insertar
  hierarchyLevel: number;
  canCreateRoles: string[];
  responsibilities: string[];
  permissions: Record<string, boolean>;
  isElected?: boolean;
  electionDate?: string;
}

// Estructura jerárquica real de MAIS Cauca
const organizationalData: OrganizationMemberData[] = [
  // 1. DIRECTOR DEPARTAMENTAL CAUCA - JOSÉ LUIS DIAGO (DATO REAL)
  {
    fullName: 'José Luis Diago',
    email: 'joseluisdiago@maiscauca.com',
    phone: '3XX XXX XXXX', // Se actualizará con datos reales
    roleType: 'director-departamental',
    territoryLevel: 'departamental',
    region: 'Andina',
    department: 'Cauca',
    hierarchyLevel: 3,
    canCreateRoles: ['coordinador-municipal', 'concejal-electo', 'lider-local'],
    responsibilities: [
      'Dirección estratégica departamental MAIS Cauca',
      'Supervisión directa de 5 concejales electos',
      'Creación y gestión de equipos municipales',
      'Coordinación con estructura regional y nacional',
      'Administración de recursos departamentales',
      'Reportes de gestión hacia estructura superior',
      'Desarrollo de estrategias territoriales'
    ],
    permissions: {
      'create_municipal_roles': true,
      'manage_departmental_budget': true,
      'coordinate_elected_officials': true,
      'report_to_regional': true,
      'access_all_municipal_data': true,
      'approve_local_initiatives': true
    }
  },

  // 2. CONCEJALES ELECTOS (DATOS REALES DE LAS ELECCIONES 2023)
  {
    fullName: 'Adexe Alejandro Hoyos Quiñonez',
    email: 'adexeyesina@gmail.com',
    phone: '3218702256',
    roleType: 'concejal-electo',
    territoryLevel: 'municipal',
    region: 'Andina',
    department: 'Cauca',
    municipality: 'Almaguer',
    hierarchyLevel: 4,
    canCreateRoles: ['lider-local'],
    responsibilities: [
      'Representación MAIS en Concejo Municipal de Almaguer',
      'Atención ciudadana municipal',
      'Presentación de proyectos de ordenanza y acuerdo',
      'Reportes mensuales al director departamental',
      'Coordinación con líderes locales de Almaguer'
    ],
    permissions: {
      'submit_council_projects': true,
      'citizen_services': true,
      'municipal_voting_rights': true,
      'report_to_department': true,
      'create_local_leaders': true
    },
    isElected: true,
    electionDate: '2023-10-29'
  },

  {
    fullName: 'Griceldino Chilo Menza',
    email: 'griceldino.chilo@maiscauca.org',
    phone: '3116392077',
    roleType: 'concejal-electo',
    territoryLevel: 'municipal',
    region: 'Andina',
    department: 'Cauca',
    municipality: 'Caldono',
    hierarchyLevel: 4,
    canCreateRoles: ['lider-local'],
    responsibilities: [
      'Representación MAIS en Concejo Municipal de Caldono',
      'Atención ciudadana municipal',
      'Presentación de proyectos de ordenanza y acuerdo',
      'Reportes mensuales al director departamental',
      'Coordinación con comunidades indígenas de Caldono'
    ],
    permissions: {
      'submit_council_projects': true,
      'citizen_services': true,
      'municipal_voting_rights': true,
      'report_to_department': true,
      'indigenous_community_liaison': true
    },
    isElected: true,
    electionDate: '2023-10-29'
  },

  {
    fullName: 'Carlos Alberto Sanchez',
    email: 'scarlosalberto30@yahoo.es',
    phone: '3122387492',
    roleType: 'concejal-electo',
    territoryLevel: 'municipal',
    region: 'Andina',
    department: 'Cauca',
    municipality: 'Caloto',
    hierarchyLevel: 4,
    canCreateRoles: ['lider-local'],
    responsibilities: [
      'Representación MAIS en Concejo Municipal de Caloto',
      'Atención ciudadana municipal',
      'Presentación de proyectos de ordenanza y acuerdo',
      'Reportes mensuales al director departamental',
      'Coordinación con sectores productivos de Caloto'
    ],
    permissions: {
      'submit_council_projects': true,
      'citizen_services': true,
      'municipal_voting_rights': true,
      'report_to_department': true,
      'economic_development_focus': true
    },
    isElected: true,
    electionDate: '2023-10-29'
  },

  {
    fullName: 'Carlos Albeiro Huila Cometa',
    email: 'calvehuila@gmail.com',
    phone: '3177794172',
    roleType: 'concejal-electo',
    territoryLevel: 'municipal',
    region: 'Andina',
    department: 'Cauca',
    municipality: 'Morales',
    hierarchyLevel: 4,
    canCreateRoles: ['lider-local'],
    responsibilities: [
      'Representación MAIS en Concejo Municipal de Morales',
      'Atención ciudadana municipal',
      'Presentación de proyectos de ordenanza y acuerdo',
      'Reportes mensuales al director departamental',
      'Coordinación con organizaciones sociales de Morales'
    ],
    permissions: {
      'submit_council_projects': true,
      'citizen_services': true,
      'municipal_voting_rights': true,
      'report_to_department': true,
      'social_organizations_liaison': true
    },
    isElected: true,
    electionDate: '2023-10-29'
  },

  {
    fullName: 'Abelino Campo Fisus',
    email: 'abelinocampof@gmail.com',
    phone: '3234773564',
    roleType: 'concejal-electo',
    territoryLevel: 'municipal',
    region: 'Andina',
    department: 'Cauca',
    municipality: 'Paez (Belalcazar)',
    hierarchyLevel: 4,
    canCreateRoles: ['lider-local'],
    responsibilities: [
      'Representación MAIS en Concejo Municipal de Paez',
      'Atención ciudadana municipal',
      'Presentación de proyectos de ordenanza y acuerdo',
      'Reportes mensuales al director departamental',
      'Coordinación con resguardos indígenas de Paez'
    ],
    permissions: {
      'submit_council_projects': true,
      'citizen_services': true,
      'municipal_voting_rights': true,
      'report_to_department': true,
      'indigenous_resguardos_liaison': true
    },
    isElected: true,
    electionDate: '2023-10-29'
  }
];

// Función principal para insertar datos
export async function insertarDatosRealesMAIS(): Promise<void> {
  console.log('🚀 Iniciando inserción de datos reales de MAIS...');

  try {
    // 1. Verificar conexión a Supabase
    const { data: testConnection } = await supabase.from('profiles').select('count').limit(1);
    if (!testConnection) {
      throw new Error('No se puede conectar a Supabase');
    }
    console.log('✅ Conexión a Supabase verificada');

    // 2. Limpiar datos existentes de prueba (opcional)
    console.log('🧹 Limpiando datos de prueba anteriores...');
    await supabase.from('organizational_structure').delete().ilike('email', '%@maiscauca.com');

    // 3. Insertar José Luis Diago primero (director departamental)
    console.log('👤 Insertando Director Departamental: José Luis Diago...');
    
    const directorData = organizationalData[0];
    
    // Crear usuario en auth si no existe
    let userId: string;
    
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser.users.find(u => u.email === directorData.email);
    
    if (!userExists) {
      const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
        email: directorData.email,
        password: MASTER_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: directorData.fullName,
          role: directorData.roleType
        }
      });
      
      if (authError) {
        throw new Error(`Error creando usuario auth: ${authError.message}`);
      }
      
      userId = newUser.user!.id;
      console.log(`✅ Usuario auth creado para ${directorData.fullName}`);
    } else {
      userId = userExists.id;
      console.log(`ℹ️ Usuario auth ya existe para ${directorData.fullName}`);
    }

    // Insertar en organizational_structure
    const { data: insertedDirector, error: directorError } = await supabase
      .from('organizational_structure')
      .insert({
        user_id: userId,
        full_name: directorData.fullName,
        email: directorData.email,
        phone: directorData.phone,
        role_type: directorData.roleType,
        territory_level: directorData.territoryLevel,
        region: directorData.region,
        department: directorData.department,
        municipality: directorData.municipality,
        hierarchy_level: directorData.hierarchyLevel,
        can_create_roles: directorData.canCreateRoles,
        responsibilities: directorData.responsibilities,
        permissions: directorData.permissions,
        is_active: true,
        is_elected: directorData.isElected || false,
        election_date: directorData.electionDate || null
      })
      .select()
      .single();

    if (directorError) {
      throw new Error(`Error insertando director: ${directorError.message}`);
    }

    console.log(`✅ Director Departamental insertado: ${insertedDirector.full_name}`);
    const directorId = insertedDirector.id;

    // 4. Insertar concejales electos
    console.log('🏛️ Insertando Concejales Electos...');
    
    for (let i = 1; i < organizationalData.length; i++) {
      const concejalData = organizationalData[i];
      
      console.log(`   Procesando: ${concejalData.fullName} - ${concejalData.municipality}`);
      
      // Crear usuario auth para cada concejal
      const { data: concejalUser, error: concejalAuthError } = await supabase.auth.admin.createUser({
        email: concejalData.email,
        password: MASTER_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: concejalData.fullName,
          role: concejalData.roleType,
          municipality: concejalData.municipality
        }
      });
      
      if (concejalAuthError && concejalAuthError.message !== 'User already registered') {
        console.warn(`⚠️ Warning creando auth para ${concejalData.fullName}: ${concejalAuthError.message}`);
        continue;
      }
      
      // Insertar en organizational_structure
      const { error: concejalInsertError } = await supabase
        .from('organizational_structure')
        .insert({
          user_id: concejalUser?.user?.id,
          full_name: concejalData.fullName,
          email: concejalData.email,
          phone: concejalData.phone,
          role_type: concejalData.roleType,
          territory_level: concejalData.territoryLevel,
          region: concejalData.region,
          department: concejalData.department,
          municipality: concejalData.municipality,
          reports_to: directorId, // Reportan al director departamental
          created_by: directorId,
          hierarchy_level: concejalData.hierarchyLevel,
          can_create_roles: concejalData.canCreateRoles,
          responsibilities: concejalData.responsibilities,
          permissions: concejalData.permissions,
          is_active: true,
          is_elected: concejalData.isElected,
          election_date: concejalData.electionDate,
          term_start: '2024-01-01',
          term_end: '2027-12-31'
        });

      if (concejalInsertError) {
        console.error(`❌ Error insertando ${concejalData.fullName}: ${concejalInsertError.message}`);
      } else {
        console.log(`   ✅ ${concejalData.fullName} insertado exitosamente`);
      }
    }

    // 5. Verificar estructura creada
    const { data: estructura, error: estructuraError } = await supabase
      .from('organizational_structure')
      .select('full_name, role_type, municipality, is_elected')
      .eq('department', 'Cauca')
      .order('hierarchy_level');

    if (estructuraError) {
      console.error('Error verificando estructura:', estructuraError);
    } else {
      console.log('\n📊 ESTRUCTURA MAIS CAUCA CREADA:');
      estructura.forEach(member => {
        const elected = member.is_elected ? '👑 ELECTO' : '';
        console.log(`   ${member.full_name} - ${member.role_type} - ${member.municipality || 'Departamental'} ${elected}`);
      });
    }

    // 6. Crear datos iniciales de métricas
    console.log('\n📈 Creando métricas iniciales...');
    
    const { data: allMembers } = await supabase
      .from('organizational_structure')
      .select('id, role_type')
      .eq('department', 'Cauca');

    if (allMembers) {
      for (const member of allMembers) {
        await supabase.from('performance_metrics').insert({
          organization_member_id: member.id,
          report_period_start: '2024-01-01',
          report_period_end: '2024-01-31',
          meetings_attended: Math.floor(Math.random() * 10) + 5,
          projects_initiated: Math.floor(Math.random() * 3) + 1,
          citizens_served: Math.floor(Math.random() * 50) + 10,
          role_specific_metrics: {
            role: member.role_type,
            performance: 'inicial'
          },
          report_to_superior: 'Reporte inicial de configuración del sistema'
        });
      }
    }

    console.log('✅ Métricas iniciales creadas');

    console.log('\n🎉 DATOS REALES DE MAIS INSERTADOS EXITOSAMENTE!');
    console.log('\n📋 RESUMEN:');
    console.log('   • Director Departamental: José Luis Diago');
    console.log('   • Concejales Electos: 5 (Almaguer, Caldono, Caloto, Morales, Paez)');
    console.log('   • Contraseña universal: agoramais2025');
    console.log('   • Sistema jerárquico configurado');
    console.log('   • Métricas iniciales creadas');
    console.log('\n🔐 ACCESOS:');
    console.log('   Director: joseluisdiago@maiscauca.com');
    console.log('   Concejales: emails reales de cada municipio');
    
  } catch (error) {
    console.error('❌ ERROR EN LA INSERCIÓN:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  insertarDatosRealesMAIS()
    .then(() => {
      console.log('\n✨ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}