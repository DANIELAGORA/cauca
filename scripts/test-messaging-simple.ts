#!/usr/bin/env tsx
/**
 * SIMPLE MESSAGING TEST
 * Tests basic messaging with existing table structure
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleMessaging() {
  console.log('🚀 SIMPLE MESSAGING TEST');
  console.log('=========================');
  
  try {
    // Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'joseluisdiago@maiscauca.com',
      password: 'agoramais2025'
    });
    
    if (authError || !authData.user) {
      console.log('❌ Login failed');
      return;
    }
    
    console.log('✅ Logged in successfully');
    
    // Get current messages table structure by selecting
    const { data: existingMessages, error: selectError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
      
    if (selectError) {
      console.log(`❌ Messages table access error: ${selectError.message}`);
    } else {
      console.log(`✅ Messages table accessible`);
      console.log(`📊 Current message count: ${existingMessages.length}`);
    }
    
    // Test simple insert with minimal data
    console.log('📝 Testing message creation...');
    
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        sender_id: authData.user.id,
        content: 'Test message from integration test'
      });
      
    if (insertError) {
      console.log(`❌ Message creation failed: ${insertError.message}`);
    } else {
      console.log('✅ Message created successfully!');
      
      // Try to read it back
      const { data: newMessages, error: readError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', authData.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (readError) {
        console.log(`❌ Message read failed: ${readError.message}`);
      } else if (newMessages && newMessages.length > 0) {
        console.log('✅ Message read successfully!');
        console.log(`📄 Content: "${newMessages[0].content}"`);
        console.log(`👤 Sender: ${newMessages[0].sender_id}`);
      }
    }
    
    await supabase.auth.signOut();
    
  } catch (error) {
    console.log(`❌ Test error: ${error}`);
  }
}

async function testSimpleFileStorage() {
  console.log('\n💾 SIMPLE FILE STORAGE TEST');
  console.log('============================');
  
  try {
    // Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'joseluisdiago@maiscauca.com',
      password: 'agoramais2025'
    });
    
    if (authError || !authData.user) {
      console.log('❌ Login failed');
      return;
    }
    
    console.log('✅ Logged in successfully');
    
    // Test databases table access
    const { data: existingFiles, error: selectError } = await supabase
      .from('databases')
      .select('*')
      .limit(1);
      
    if (selectError) {
      console.log(`❌ Databases table access error: ${selectError.message}`);
    } else {
      console.log(`✅ Databases table accessible`);
      console.log(`📊 Current file count: ${existingFiles.length}`);
    }
    
    // Test simple file entry insert
    console.log('📁 Testing file entry creation...');
    
    const { error: insertError } = await supabase
      .from('databases')
      .insert({
        user_id: authData.user.id,
        file_name: 'test-integration.txt',
        file_type: 'text/plain'
      });
      
    if (insertError) {
      console.log(`❌ File entry creation failed: ${insertError.message}`);
    } else {
      console.log('✅ File entry created successfully!');
      
      // Read it back
      const { data: newFiles, error: readError } = await supabase
        .from('databases')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (readError) {
        console.log(`❌ File entry read failed: ${readError.message}`);
      } else if (newFiles && newFiles.length > 0) {
        console.log('✅ File entry read successfully!');
        console.log(`📄 File name: "${newFiles[0].file_name}"`);
        console.log(`📎 File type: ${newFiles[0].file_type}`);
      }
    }
    
    await supabase.auth.signOut();
    
  } catch (error) {
    console.log(`❌ Test error: ${error}`);
  }
}

async function runSimpleTests() {
  console.log('🎯 MAIS CAUCA - SIMPLE INTEGRATION TESTS');
  console.log('=========================================');
  
  await testSimpleMessaging();
  await testSimpleFileStorage();
  
  console.log('\n🎉 SIMPLE TESTS COMPLETED!');
}

runSimpleTests().catch(console.error);