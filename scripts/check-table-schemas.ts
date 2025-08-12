#!/usr/bin/env tsx
/**
 * CHECK ACTUAL TABLE SCHEMAS
 * Discovers the real column structure of existing tables
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZUI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableSchema(tableName: string) {
  console.log(`\n🔍 CHECKING TABLE: ${tableName}`);
  console.log('=' * 40);
  
  try {
    // First login to authenticate
    await supabase.auth.signInWithPassword({
      email: 'joseluisdiago@maiscauca.com',
      password: 'agoramais2025'
    });
    
    // Try to select all columns with limit 1 to see structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (error) {
      console.log(`❌ Error accessing ${tableName}: ${error.message}`);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log(`📊 Table ${tableName} is empty, trying to insert test record...`);
      
      // Try minimal insert to see required columns
      const testInsert = await supabase
        .from(tableName)
        .insert({});
        
      if (testInsert.error) {
        console.log(`❌ Insert error reveals required fields: ${testInsert.error.message}`);
      }
      
    } else {
      console.log(`✅ Table ${tableName} has ${data.length} records`);
      console.log('🔑 Available columns:');
      
      Object.keys(data[0]).forEach(column => {
        const value = data[0][column];
        const type = typeof value;
        console.log(`   - ${column}: ${type} = ${value}`);
      });
    }
    
  } catch (err) {
    console.log(`❌ Error checking ${tableName}: ${err}`);
  }
}

async function checkAllTables() {
  console.log('🔍 MAIS CAUCA - TABLE SCHEMA DISCOVERY');
  console.log('=====================================');
  
  const tablesToCheck = ['user_profiles', 'profiles', 'messages', 'databases'];
  
  for (const table of tablesToCheck) {
    await checkTableSchema(table);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎯 SCHEMA DISCOVERY COMPLETED');
}

checkAllTables().catch(console.error);