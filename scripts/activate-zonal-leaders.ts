#!/usr/bin/env tsx
// ACTIVAR LÍDERES ZONALES
// Cambiar status de pending a active

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkzMDE3NiwiZXhwIjoyMDcwNTA2MTc2fQ.DJhWtNGqjI-q82oNIIamPb_AQb9-L7MjTSPvWQRx6D4';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const LIDERES_ZONALES = [
  'carlos.vallejo@maiscauca.com',
  'maria.gonzalez@maiscauca.com',
  'roberto.munoz@maiscauca.com', 
  'ana.torres@maiscauca.com',
  'luis.chocue@maiscauca.com'
];

console.log('⚡ ACTIVANDO LÍDERES ZONALES...');

async function activateLeaders() {
  for (const email of LIDERES_ZONALES) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'active' })
      .eq('email', email);

    if (error) {
      console.log(`❌ Error activando ${email}: ${error.message}`);
    } else {
      console.log(`✅ Activado: ${email}`);
    }
  }
  console.log('🎉 LÍDERES ZONALES ACTIVADOS');
}

activateLeaders();