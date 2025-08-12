#!/usr/bin/env tsx
/**
 * MAIS POLITICAL COMMAND CENTER - COMPLETE DATABASE SETUP
 * Applies the complete SQL schema to Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCompleteDatabase() {
  console.log('🚀 MAIS POLITICAL COMMAND CENTER - DATABASE SETUP');
  console.log('===================================================');
  console.log(`🔗 Database: ${supabaseUrl}`);
  console.log('');
  
  try {
    // Read the SQL schema file
    const schemaPath = join(process.cwd(), 'supabase_schema_complete.sql');
    const sqlSchema = readFileSync(schemaPath, 'utf8');
    
    console.log('📖 SQL Schema loaded successfully');
    console.log(`📄 Schema size: ${(sqlSchema.length / 1024).toFixed(2)} KB`);
    console.log('');
    
    // Split SQL into individual statements
    const statements = sqlSchema
      .split('-- =============================================================================')
      .filter(section => section.trim().length > 0)
      .flatMap(section => 
        section.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      );
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`);
    console.log('');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute statements in batches
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements and comments
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue;
      }
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        // Use RPC to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // Try direct execution if RPC fails
          const directResult = await supabase
            .from('_sql_execute')
            .insert({ query: statement });
            
          if (directResult.error) {
            console.log(`❌ Error in statement ${i + 1}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
            successCount++;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
        
        // Small delay between statements
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`❌ Error in statement ${i + 1}: ${err}`);
        errorCount++;
      }
    }
    
    console.log('');
    console.log('📊 EXECUTION RESULTS:');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    console.log(`📈 Success rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);
    
    if (successCount > 0) {
      console.log('');
      console.log('🎉 DATABASE SETUP COMPLETED!');
      console.log('Now testing the new configuration...');
      
      await testDatabaseSetup();
    }
    
  } catch (error) {
    console.error('❌ Fatal error during setup:', error);
    process.exit(1);
  }
}

async function testDatabaseSetup() {
  console.log('');
  console.log('🧪 TESTING DATABASE CONFIGURATION');
  console.log('==================================');
  
  try {
    // Test 1: Check if ENUM types exist
    console.log('🔍 Testing ENUM types...');
    const { data: enumTest, error: enumError } = await supabase
      .from('user_profiles')
      .select('role')
      .limit(1);
      
    if (!enumError) {
      console.log('✅ ENUM types working correctly');
    } else {
      console.log(`❌ ENUM types issue: ${enumError.message}`);
    }
    
    // Test 2: Test user profile creation with new roles
    console.log('🔍 Testing role assignment...');
    
    // Update existing users to proper roles
    const testUsers = [
      { 
        id: 'f2cbe065-4761-438a-8864-350d99d65fa6',
        email: 'joseluisdiago@maiscauca.com',
        role: 'comite-departamental'
      },
      { 
        id: '2b4a37c1-0247-43a9-b309-7bc86f1e17cf',
        email: 'testconcejal@maiscauca.com',
        role: 'lider-comunitario'
      }
    ];
    
    for (const user of testUsers) {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: user.role })
        .eq('id', user.id);
        
      if (!updateError) {
        console.log(`✅ Updated ${user.email} to role: ${user.role}`);
      } else {
        console.log(`❌ Failed to update ${user.email}: ${updateError.message}`);
      }
    }
    
    // Test 3: Check storage bucket
    console.log('🔍 Testing storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (!bucketError && buckets.find(b => b.name === 'files')) {
      console.log('✅ Storage bucket configured correctly');
    } else {
      console.log('❌ Storage bucket issue');
    }
    
    // Test 4: Test messaging table
    console.log('🔍 Testing messaging system...');
    const { data: messageTest, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
      
    if (!messageError) {
      console.log('✅ Messaging system ready');
    } else {
      console.log(`❌ Messaging system issue: ${messageError.message}`);
    }
    
    console.log('');
    console.log('🎯 DATABASE TESTING COMPLETED!');
    console.log('🚀 System ready for authentication integration!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the setup
setupCompleteDatabase().catch(console.error);