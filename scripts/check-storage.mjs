import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Tentar carregar do arquivo .env
let envUrl = '';
let envKey = '';
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
    const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
    if (urlMatch) envUrl = urlMatch[1];
    if (keyMatch) envKey = keyMatch[1];
  }
} catch (e) {
  // Ignorar erros
}

const SUPABASE_URL = envUrl || 'https://ranchoprado.vendopro.com.br';
const SUPABASE_ANON_KEY = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.0if6RmuwClXzN1FBo0qE4a8TNRrKEuVMPDC4PVK9O2A';

const ADMIN_EMAIL = 'wislleyprado@gmail.com';
const ADMIN_PASSWORD = '1902Prado#2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🏁 Starting Supabase storage diagnostic...\n');

  // 1. Login
  console.log('1. Attempting login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    return;
  }
  
  const userId = loginData.user.id;
  console.log(`✅ Login successful! User ID: ${userId}`);

  // 2. Check roles
  console.log('\n2. Checking roles for user...');
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);

  if (rolesError) {
    console.error('❌ Error checking roles:', rolesError.message);
  } else {
    console.log('✅ Roles in database:', roles);
  }

  // 3. List buckets
  console.log('\n3. Checking visible storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError.message);
  } else {
    console.log('✅ Visible buckets:');
    buckets.forEach(b => console.log(`   - Name: "${b.name}" | ID: "${b.id}" | Public: ${b.public}`));
  }

  // 4. Try upload
  console.log('\n4. Attempting test file upload to "configuracoes" bucket...');
  const testContent = 'diagnostic-test-' + Date.now();
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('configuracoes')
    .upload('test-diagnostic.txt', Buffer.from(testContent), {
      contentType: 'text/plain',
      upsert: true
    });

  if (uploadError) {
    console.error('❌ Upload to "configuracoes" failed:', uploadError);
  } else {
    console.log('✅ Upload to "configuracoes" successful!', uploadData);
    
    // Clean up
    console.log('\n5. Cleaning up test file...');
    const { error: removeError } = await supabase.storage
      .from('configuracoes')
      .remove(['test-diagnostic.txt']);
      
    if (removeError) {
      console.error('❌ Error cleaning up test file:', removeError.message);
    } else {
      console.log('✅ Clean up successful!');
    }
  }
}

main().catch(console.error);
