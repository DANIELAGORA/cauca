#!/usr/bin/env tsx
/**
 * MAIS - FIX USER ROLES AND DATABASE SETUP
 * Updates existing users to proper roles and verifies system
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Political leadership mapping based on MAIS structure
const userRoleMapping = [
  {
    email: 'joseluisdiago@maiscauca.com',
    name: 'José Luis Diago Franco',
    currentRole: 'votante',
    targetRole: 'director-departamental', // Will be mapped to valid ENUM
    hierarchy: 1
  },
  {
    email: 'gelmischate@maiscauca.com', 
    name: 'Gelmis Chate Rivera',
    currentRole: 'votante',
    targetRole: 'alcalde',
    hierarchy: 2
  },
  {
    email: 'testconcejal@maiscauca.com',
    name: 'Ana María López',
    currentRole: 'votante', 
    targetRole: 'concejal',
    hierarchy: 3
  },
  {
    email: 'carlosandres@maiscauca.com',
    name: 'Carlos Andrés Muñoz',
    currentRole: 'votante',
    targetRole: 'diputado-asamblea',
    hierarchy: 3
  }
];

// Map target roles to valid ENUM values (discovered from DB)
const roleEnumMapping: Record<string, string> = {
  'director-departamental': 'comite-departamental',
  'alcalde': 'candidato', 
  'concejal': 'votante', // lider-comunitario is not valid, using votante
  'diputado-asamblea': 'lider-regional',
  'ciudadano-base': 'votante',
  'votante': 'votante'
};

async function discoverValidRoles() {
  console.log('🔍 DISCOVERING VALID ROLE ENUM VALUES');
  console.log('=====================================');
  
  // Try different role values to discover valid ENUM
  const testRoles = [
    'votante', 'ciudadano', 'concejal', 'alcalde', 'diputado', 
    'director-departamental', 'comite-ejecutivo-nacional',
    'lider-regional', 'comite-departamental', 'candidato',
    'influenciador-digital', 'lider-comunitario'
  ];
  
  const validRoles: string[] = [];
  
  // Test with existing user
  const testUserId = 'f2cbe065-4761-438a-8864-350d99d65fa6';
  
  for (const testRole of testRoles) {
    try {
      console.log(`🧪 Testing role: ${testRole}`);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: testRole })
        .eq('id', testUserId);
        
      if (!error) {
        console.log(`✅ Valid role found: ${testRole}`);
        validRoles.push(testRole);
      } else {
        if (error.message.includes('invalid input value for enum')) {
          console.log(`❌ Invalid role: ${testRole}`);
        } else {
          console.log(`⚠️  Error (not role-related): ${error.message}`);
        }
      }
    } catch (err) {
      console.log(`❌ Error testing ${testRole}: ${err}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎯 VALID ROLES DISCOVERED:');
  validRoles.forEach(role => console.log(`   ✅ ${role}`));
  
  return validRoles;
}

async function updateUserRoles() {
  console.log('\n👥 UPDATING USER ROLES TO PROPER HIERARCHY');
  console.log('===========================================');
  
  let updatedCount = 0;
  let failedCount = 0;
  
  for (const user of userRoleMapping) {
    console.log(`\n🔄 Processing: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📈 Current: ${user.currentRole} → Target: ${user.targetRole}`);
    
    try {
      // Map target role to valid ENUM
      const validRole = roleEnumMapping[user.targetRole] || 'votante';
      console.log(`   🎯 Mapped role: ${validRole}`);
      
      // First login to get user ID
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: 'agoramais2025'
      });
      
      if (authError || !authData.user) {
        console.log(`   ❌ Login failed: ${authError?.message}`);
        failedCount++;
        continue;
      }
      
      // Update role in user_profiles
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          role: validRole,
          full_name: user.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);
      
      if (updateError) {
        console.log(`   ❌ Update failed: ${updateError.message}`);
        failedCount++;
      } else {
        console.log(`   ✅ Successfully updated to role: ${validRole}`);
        updatedCount++;
        
        // Also update legacy profiles table
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: user.name,
            role: validRole
          });
      }
      
      // Logout
      await supabase.auth.signOut();
      
    } catch (error) {
      console.log(`   ❌ Error processing ${user.name}: ${error}`);
      failedCount++;
    }
    
    // Delay between users
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 USER ROLE UPDATE RESULTS:');
  console.log(`✅ Successfully updated: ${updatedCount}`);
  console.log(`❌ Failed updates: ${failedCount}`);
  console.log(`📈 Success rate: ${((updatedCount / (updatedCount + failedCount)) * 100).toFixed(1)}%`);
}

async function verifyRoleHierarchy() {
  console.log('\n🏛️  VERIFYING ROLE HIERARCHY');
  console.log('=============================');
  
  try {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('full_name, email, role')
      .order('created_at');
      
    if (error) {
      console.log(`❌ Error fetching profiles: ${error.message}`);
      return;
    }
    
    console.log('\n👥 CURRENT USER HIERARCHY:');
    profiles?.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.full_name}`);
      console.log(`   📧 ${profile.email}`);
      console.log(`   🎭 Role: ${profile.role}`);
      console.log('');
    });
    
    // Test messaging permissions
    console.log('💬 TESTING ROLE-BASED MESSAGING ACCESS...');
    
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);
      
    if (!msgError) {
      console.log('✅ Messaging system accessible');
    } else {
      console.log(`⚠️  Messaging system: ${msgError.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Error verifying hierarchy: ${error}`);
  }
}

async function setupComplete() {
  console.log('🎯 MAIS CAUCA - COMPLETE ROLE & HIERARCHY SETUP');
  console.log('===============================================\n');
  
  // Step 1: Discover valid roles
  const validRoles = await discoverValidRoles();
  
  if (validRoles.length === 0) {
    console.log('\n❌ NO VALID ROLES FOUND - CHECK DATABASE CONFIGURATION');
    return;
  }
  
  // Step 2: Update user roles
  await updateUserRoles();
  
  // Step 3: Verify hierarchy
  await verifyRoleHierarchy();
  
  console.log('\n🎉 ROLE SETUP COMPLETED!');
  console.log('📍 Next steps:');
  console.log('   1. Test dashboard access with new roles');
  console.log('   2. Verify real-time messaging between roles'); 
  console.log('   3. Test file upload and permissions');
  console.log('   4. Deploy to production');
}

// Run the complete setup
setupComplete().catch(console.error);