#!/usr/bin/env tsx
/**
 * SCRIPT BYPASS RLS - INTENTA DESACTIVAR RLS TEMPORALMENTE
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectInsert() {
  console.log('🎯 TESTING BYPASS RLS - INSERCIÓN DIRECTA');
  console.log('=' * 50);
  
  // Login first
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'joseluisdiago@maiscauca.com',
    password: 'agoramais2025'
  });
  
  if (authError || !authData.user) {
    console.log(`❌ Login failed: ${authError?.message}`);
    return;
  }
  
  console.log(`✅ Logged in as: ${authData.user.email}`);
  console.log(`📧 User ID: ${authData.user.id}`);
  
  // Try minimal insert without role (avoid ENUM issues)
  console.log('\n🔄 Trying minimal profile insert...');
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      email: authData.user.email,
      full_name: 'José Luis Diago Franco'
      // NO ROLE - avoid enum issues
    })
    .select()
    .single();
    
  if (error) {
    console.log(`❌ Insert failed: ${error.message}`);
    
    // Check if profile already exists
    console.log('\n🔍 Checking if profile exists...');
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id);
      
    if (existing && existing.length > 0) {
      console.log('✅ Profile already exists!');
      console.log('Profile data:', existing[0]);
    } else {
      console.log('❌ No profile found');
    }
  } else {
    console.log('🎉 SUCCESS! Profile created:');
    console.log(data);
  }
  
  await supabase.auth.signOut();
}

testDirectInsert().catch(console.error);

console.log('\n💡 SI SIGUE FALLANDO, EJECUTA EN SUPABASE:');
console.log('ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;');