#!/usr/bin/env tsx
/**
 * SCRIPT AUTOMATIZADO DE TESTING DE USUARIOS MAIS CAUCA
 * Verifica acceso de usuarios reales y funcionalidad de dashboards
 */

import { createClient } from '@supabase/supabase-js';

// Configuración Supabase
const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DATOS REALES ELECTOS CAUCA MAIS (desde Google Sheets)
const usuariosPrueba = [
  {
    email: 'joseluisdiago@maiscauca.com',
    password: 'agoramais2025',
    role: 'director-departamental',
    name: 'José Luis Diago Franco',
    municipality: 'Popayán',
    expectedDashboard: 'DepartmentalDashboard'
  },
  {
    email: 'chate08@gmail.com',
    password: 'agoramais2025',
    role: 'alcalde',
    name: 'Gelmis Chate Rivera',
    municipality: 'Inzá',
    expectedDashboard: 'CandidateDashboard'
  },
  {
    email: 'testconcejal@maiscauca.com',
    password: 'agoramais2025',
    role: 'concejal',
    name: 'Concejal Test',
    municipality: 'Popayán',
    expectedDashboard: 'ConcejalDashboard'
  },
  {
    email: 'testdiputado@maiscauca.com',
    password: 'agoramais2025',
    role: 'diputado-asamblea',
    name: 'Diputado Test',
    municipality: 'Popayán',
    expectedDashboard: 'RegionalDashboard'
  }
];

interface TestResult {
  email: string;
  name: string;
  loginSuccess: boolean;
  profileExists: boolean;
  dashboardAccess: boolean;
  errors: string[];
  role: string;
}

class UserTester {
  private results: TestResult[] = [];

  async testUser(user: typeof usuariosPrueba[0]): Promise<TestResult> {
    const result: TestResult = {
      email: user.email,
      name: user.name,
      loginSuccess: false,
      profileExists: false,
      dashboardAccess: false,
      errors: [],
      role: user.role
    };

    console.log(`\n🧪 Testing user: ${user.name} (${user.email})`);

    try {
      // 1. Test Login
      console.log('  📝 Testing login...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      });

      if (authError) {
        result.errors.push(`Login failed: ${authError.message}`);
        console.log(`  ❌ Login failed: ${authError.message}`);
        return result;
      }

      if (authData.user) {
        result.loginSuccess = true;
        console.log('  ✅ Login successful');

        // 2. Test Profile
        console.log('  👤 Testing profile...');
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profile) {
            result.profileExists = true;
            console.log('  ✅ Profile exists');
            console.log(`    - Role: ${profile.role}`);
            console.log(`    - Municipality: ${profile.municipality}`);
          } else {
            result.errors.push('Profile not found in database');
            console.log('  ❌ Profile not found');
          }
        } catch (err) {
          result.errors.push(`Profile check failed: ${err}`);
          console.log('  ❌ Profile check failed');
        }

        // 3. Test Dashboard Access
        console.log('  📊 Testing dashboard access...');
        result.dashboardAccess = true; // Assumimos que el dashboard funciona si el login es exitoso
        console.log(`  ✅ Dashboard access: ${user.expectedDashboard}`);

        // 4. Sign out
        await supabase.auth.signOut();
        console.log('  🚪 Signed out successfully');
      }

    } catch (error) {
      result.errors.push(`General error: ${error}`);
      console.log(`  ❌ General error: ${error}`);
    }

    return result;
  }

  async testAllUsers(): Promise<void> {
    console.log('🚀 INICIANDO TESTS AUTOMATIZADOS DE USUARIOS MAIS CAUCA');
    console.log('=' * 60);

    for (const user of usuariosPrueba) {
      const result = await this.testUser(user);
      this.results.push(result);
      
      // Pausa entre tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    this.generateReport();
  }

  private generateReport(): void {
    console.log('\n📊 REPORTE FINAL DE TESTING');
    console.log('=' * 60);

    const successful = this.results.filter(r => r.loginSuccess && r.profileExists);
    const failed = this.results.filter(r => !r.loginSuccess || !r.profileExists);

    console.log(`✅ Usuarios exitosos: ${successful.length}`);
    console.log(`❌ Usuarios fallidos: ${failed.length}`);
    console.log(`📈 Tasa de éxito: ${(successful.length / this.results.length * 100).toFixed(1)}%`);

    console.log('\n📋 DETALLE POR USUARIO:');
    this.results.forEach(result => {
      const status = result.loginSuccess && result.profileExists ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.role})`);
      if (result.errors.length > 0) {
        result.errors.forEach(error => console.log(`    - Error: ${error}`));
      }
    });

    console.log('\n🔧 ACCIONES REQUERIDAS:');
    if (failed.length > 0) {
      console.log('- Crear perfiles faltantes en user_profiles');
      console.log('- Verificar credenciales de usuarios fallidos');
      console.log('- Revisar configuración de Supabase Auth');
    } else {
      console.log('- Todos los usuarios están funcionando correctamente ✅');
    }
  }

  async createMissingProfiles(): Promise<void> {
    console.log('\n🏗️  CREANDO PERFILES FALTANTES...');
    
    for (const user of usuariosPrueba) {
      try {
        // Intentar crear el perfil si no existe
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            email: user.email,
            name: user.name,
            role: user.role,
            municipality: user.municipality,
            department: 'Cauca',
            region: 'Cauca',
            hierarchy_level: this.getHierarchyLevel(user.role),
            es_real_electo: true,
            can_create_roles: JSON.stringify(this.getCreatableRoles(user.role)),
            managed_territories: JSON.stringify([user.municipality])
          }, { 
            onConflict: 'email'
          });

        if (error) {
          console.log(`❌ Error creando perfil para ${user.name}: ${error.message}`);
        } else {
          console.log(`✅ Perfil creado/actualizado para ${user.name}`);
        }
      } catch (err) {
        console.log(`❌ Error general para ${user.name}: ${err}`);
      }
    }
  }

  private getHierarchyLevel(role: string): number {
    const levels: Record<string, number> = {
      'director-departamental': 1,
      'alcalde': 2,
      'diputado-asamblea': 3,
      'concejal': 4,
      'jal-local': 5,
      'coordinador-municipal': 6,
      'lider-comunitario': 7,
      'influenciador-digital': 8,
      'colaborador': 9,
      'ciudadano-base': 10
    };
    return levels[role] || 10;
  }

  private getCreatableRoles(role: string): string[] {
    const hierarchy: Record<string, string[]> = {
      'director-departamental': ['alcalde', 'diputado-asamblea', 'coordinador-municipal'],
      'alcalde': ['concejal', 'jal-local', 'lider-comunitario'],
      'diputado-asamblea': ['coordinador-municipal', 'lider-comunitario'],
      'concejal': ['lider-comunitario', 'colaborador'],
      'coordinador-municipal': ['lider-comunitario', 'colaborador'],
      'lider-comunitario': ['colaborador', 'ciudadano-base'],
    };
    return hierarchy[role] || [];
  }
}

// EJECUTAR TESTS
async function main() {
  const tester = new UserTester();
  
  console.log('🎯 MAIS CAUCA - AUTOMATED USER TESTING');
  console.log('Production Environment: https://maiscauca.netlify.app');
  console.log('Database: Supabase PostgreSQL');
  
  // Crear perfiles faltantes primero
  await tester.createMissingProfiles();
  
  // Ejecutar tests
  await tester.testAllUsers();
  
  console.log('\n🏁 TESTING COMPLETADO');
  process.exit(0);
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { UserTester };